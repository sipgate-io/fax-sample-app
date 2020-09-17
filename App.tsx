import React, {useState, useEffect} from 'react';
import {View, StatusBar, Platform, StyleSheet} from 'react-native';

import Main from './pages/Main';
import Login from './pages/Login';
import History from './pages/History';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {LOGIN_KEY} from './storage/keys';
import {SipgateIOClient, sipgateIO} from 'sipgateio/dist/core';
import {getAuthenticatedWebuser} from 'sipgateio/dist/core/helpers/authorizationInfo';
import AppHeader from './components/AppHeader';
import {BackgroundImage} from './components/BackgroundImage';
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
  const [client, setClient] = useState<SipgateIOClient | null | undefined>(
    undefined,
  );

  const [faxlines, setFaxlines] = useState<FaxlineResponse[]>([]);

  const [activePage, setActivePage] = useState<ActivePage>();

  const {setItem, getItem, removeItem} = useAsyncStorage(LOGIN_KEY);

  useEffect(() => {
    getItem().then((credentialsString: string | null) => {
      if (credentialsString !== null) {
        const credentials = JSON.parse(credentialsString);
        const client = sipgateIO(credentials);
        setActivePage(ActivePage.MAIN);
        setClient(client);
      } else {
        setActivePage(ActivePage.LOGIN);
        setClient(null);
      }
    });
  }, []);

  const login = (username: string, password: string) => {
    const credentials = {username, password};
    const client = sipgateIO(credentials);
    setItem(JSON.stringify(credentials));
    setActivePage(ActivePage.MAIN);
    setClient(client);
  };

  const logout = () => {
    removeItem();
    setActivePage(ActivePage.LOGIN);
    setClient(null);
  };

  if (client) {
    getUserFaxlines(client).then(setFaxlines).catch(console.log);
  }

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
