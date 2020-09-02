import React, {useState, useEffect} from 'react';
import {StyleSheet, Image, View, StatusBar, Platform} from 'react-native';

import Main from './pages/Main';
import Login from './pages/Login';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {LOGIN_KEY} from './storage/keys';
import {BackgroundImage} from './components/BackgroundImage';

export interface Credentials {
  username: string;
  password: string;
}

export default function App() {
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 20;

  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

  const {setItem, getItem, removeItem} = useAsyncStorage(LOGIN_KEY);

  useEffect(() => {
    getItem()
      .then((value) => (value ? JSON.parse(value) : null))
      .then(setCredentials);
  }, []);

  const login = (username: string, password: string) => {
    const credentials = {username, password};
    setItem(JSON.stringify(credentials));
    setCredentials(credentials);
  };

  const logout = () => {
    removeItem();
    setCredentials(null);
  };

  return (
    <BackgroundImage source={require('./assets/background.png')}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <View style={{padding: 32, paddingTop: STATUSBAR_HEIGHT + 2}}>
        {credentials === null && <Login login={login} />}
        {credentials && <Main credentials={credentials} logout={logout} />}
      </View>
    </BackgroundImage>
  );
}
