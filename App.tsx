import React, {useState, useEffect} from 'react';
import {View, StatusBar, Platform, StyleSheet} from 'react-native';
import * as Keychain from 'react-native-keychain';

import Main from './pages/Main';
import Login from './pages/Login';
import History from './pages/History';

import {BackgroundImage} from './components/BackgroundImage';
import {SipgateIOClient, sipgateIO} from 'sipgateio/dist/core';
import {getAuthenticatedWebuser} from 'sipgateio/dist/core/helpers/authorizationInfo';
import AppHeader from './components/AppHeader';
import {sipgateIOPattern} from './assets/images';

export enum ActivePage {
  MAIN,
  LOGIN,
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

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 20;

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>();

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
      setActivePage(ActivePage.MAIN);
      getUserFaxlines(client)
        .then(setFaxlines)
        .then(() => console.log(faxlines))
        .catch(console.log);
    } else {
      setClient(null);
      setActivePage(ActivePage.LOGIN);
    }
  };

  const login = async (username: string, password: string) => {
    const credentials = {username, password};
    const client = sipgateIO(credentials);
    await Keychain.setGenericPassword(username, password);
    setActivePage(ActivePage.MAIN);
    setClient(client);
  };

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setActivePage(ActivePage.LOGIN);
    setClient(null);
  };

  const renderActivePage = (page: ActivePage) => {
    if (page === ActivePage.LOGIN || !client) {
      return <Login login={login} />;
    } else if (page === ActivePage.MAIN) {
      return <Main client={client} faxlines={faxlines} />;
    } else if (page === ActivePage.HISTORY) {
      return <History client={client} />;
    } else {
      return null;
    }
  };

  return (
    <BackgroundImage source={sipgateIOPattern}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      {activePage !== undefined ? (
        <View style={styles.appContent}>
          <AppHeader
            logout={logout}
            activePage={activePage}
            setActivePage={setActivePage}
            showControls={activePage !== ActivePage.LOGIN}
          />
          {renderActivePage(activePage)}
        </View>
      ) : null}
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  appContent: {
    padding: 32,
    paddingTop: STATUSBAR_HEIGHT + 2,
  },

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
