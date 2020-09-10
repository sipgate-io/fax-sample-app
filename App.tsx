import React, {useState, useEffect} from 'react';
import {View, StatusBar, Platform} from 'react-native';

import Main from './pages/Main';
import Login from './pages/Login';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {LOGIN_KEY} from './storage/keys';
import {BackgroundImage} from './components/BackgroundImage';
import {SipgateIOClient, sipgateIO} from 'sipgateio/dist/core';
import {getAuthenticatedWebuser} from 'sipgateio/dist/core/helpers/authorizationInfo';

export interface Credentials {
  username: string;
  password: string;
}

interface FaxlinesResponse {
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
        {client === null && <Login login={login} />}
        {client && <Main client={client} logout={logout} faxlines={faxlines} />}
      </View>
    </BackgroundImage>
  );
}
