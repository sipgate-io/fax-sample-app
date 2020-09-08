import React, {useState, useEffect} from 'react';
import {StyleSheet, Image, View, StatusBar, Platform} from 'react-native';

import Main from './pages/Main';
import Login from './pages/Login';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {LOGIN_KEY} from './storage/keys';
import {BackgroundImage} from './components/BackgroundImage';
import { SipgateIOClient, sipgateIO } from 'sipgateio/dist/core';

export interface Credentials {
  username: string;
  password: string;
}

export default function App() {
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 20;

  const [client, setClient] = useState<
    SipgateIOClient | null | undefined
  >(undefined);

  const {setItem, getItem, removeItem} = useAsyncStorage(LOGIN_KEY);

  useEffect(() => {
    getItem()
      .then((credentialsString: string | null) => {
        if(credentialsString !== null) {
          const credentials = JSON.parse(credentialsString);
          const client = sipgateIO(credentials);
          setClient(client);
        } else {
          setClient(null);
        }
      }) 
  }, []);

  const login = (username: string, password: string) => {
    const credentials = {username, password};
    const client = sipgateIO(credentials);
    setItem(JSON.stringify(credentials));
    setClient(client);
  };

  const logout = () => {
    removeItem();
    setClient(null);
  };

  return (
    <BackgroundImage source={require('./assets/background.png')}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <View style={{padding: 32, paddingTop: STATUSBAR_HEIGHT + 2}}>
        {client === null && <Login login={login} />}
        {client && <Main client={client} logout={logout} />}
      </View>
    </BackgroundImage>
  );
}
