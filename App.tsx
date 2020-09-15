import React, {useState, useEffect} from 'react';
import {View, StatusBar, Platform, Image, StyleSheet} from 'react-native';

import Main from './pages/Main';
import Login from './pages/Login';
import History from './pages/History';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {LOGIN_KEY} from './storage/keys';
import {BackgroundImage} from './components/BackgroundImage';
import {SipgateIOClient, sipgateIO} from 'sipgateio/dist/core';
import {getAuthenticatedWebuser} from 'sipgateio/dist/core/helpers/authorizationInfo';
import Button from './components/Button';

export enum ActivePage {
  MAIN,
  HISTORY,
}

export interface Credentials {
  username: string;
  password: string;
}

export interface FaxlinesResponse {
  items: FaxlineResponse[];
}

export interface FaxlineResponse {
  id: string;
  alias: string;
  tagline: string;
  canSend: boolean;
  canReceive: boolean;
}

async function getUserFaxlines(
  client: SipgateIOClient,
): Promise<FaxlineResponse[]> {
  const webuserId = await getAuthenticatedWebuser(client);
  return await client
    .get<FaxlinesResponse>(`${webuserId}/faxlines`)
    .then((response) => response.items);
}

export default function App() {
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 20;

  const [client, setClient] = useState<SipgateIOClient | null | undefined>(
    undefined,
  );

  const [faxlines, setFaxlines] = useState<FaxlineResponse[]>([]);

  const [activePage, setActivePage] = useState<ActivePage>(ActivePage.MAIN);

  const {setItem, getItem, removeItem} = useAsyncStorage(LOGIN_KEY);

  useEffect(() => {
    getItem().then((credentialsString: string | null) => {
      if (credentialsString !== null) {
        const credentials = JSON.parse(credentialsString);
        const client = sipgateIO(credentials);
        setClient(client);
      } else {
        setClient(null);
      }
    });
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

  if (client) {
    getUserFaxlines(client).then(setFaxlines).catch(console.log);
  }

  return (
    <BackgroundImage source={require('./assets/background.png')}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <View style={{padding: 32, paddingTop: STATUSBAR_HEIGHT + 2}}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('./assets/images/sipgateIO.png')}
          />
          <Button color="primary" title="Logout" onPress={logout} />
          {client && activePage === ActivePage.MAIN ? (
            <Button
              color="secondary"
              title="History"
              onPress={() => setActivePage(ActivePage.HISTORY)}
            />
          ) : (
            <Button
              color="secondary"
              title="Back"
              onPress={() => setActivePage(ActivePage.MAIN)}
            />
          )}
        </View>
        {!client && <Login login={login} />}
        {client && activePage === ActivePage.MAIN && (
          <Main client={client} logout={logout} faxlines={faxlines} />
        )}
        {client && activePage === ActivePage.HISTORY && (
          <History client={client} logout={logout} />
        )}
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 8 * 16,
    height: 4 * 16,
    resizeMode: 'contain',
  },
});
