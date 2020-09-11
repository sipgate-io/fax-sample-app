import React, {useState, useEffect} from 'react';
import {View, StatusBar, Platform} from 'react-native';
import * as Keychain from 'react-native-keychain';

import Main from './pages/Main';
import Login from './pages/Login';

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
    Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 20;

  const [client, setClient] = useState<SipgateIOClient | null | undefined>(
    undefined,
  );

  const [faxlines, setFaxlines] = useState<FaxlineResponse[]>([]);

  useEffect(() => {
    retrieveLoginData();
  }, []);

  const retrieveLoginData = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const client = sipgateIO(credentials);
      setClient(client);
      if (client) {
        getUserFaxlines(client).then(setFaxlines).catch(console.log);
      }
    } else {
      setClient(null);
    }
  };

  const login = async (username: string, password: string) => {
    const credentials = {username, password};
    const client = sipgateIO(credentials);
    console.log("io successfull");
    
    await Keychain.setGenericPassword(username, password);
    console.log(credentials);
    
    setClient(client);
  };

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setClient(null);
  };

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
