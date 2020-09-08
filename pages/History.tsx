import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import LogoutButton from '../components/LogoutButton';
import {
  SipgateIOClient,
  FaxHistoryEntry,
  createHistoryModule,
  HistoryDirection,
  HistoryEntryType,
} from 'sipgateio';

interface Props {
  client: SipgateIOClient;
  logout: () => void;
}

function getFaxHistoryEntries(
  client: SipgateIOClient,
): Promise<FaxHistoryEntry[]> {
  const historyModule = createHistoryModule(client);
  return historyModule.fetchAll({
    types: [HistoryEntryType.FAX],
    directions: [HistoryDirection.OUTGOING],
  }) as Promise<FaxHistoryEntry[]>;
}

function renderHistoryItem(item: FaxHistoryEntry) {
  return (
    <View>
      <Text style={styles.item}>{item.faxStatus}</Text>
    </View>
  );
}

export default function History({client, logout}: Props) {
  const [history, setHistory] = useState<FaxHistoryEntry[]>();

  useEffect(() => {
    getFaxHistoryEntries(client).then(setHistory).catch(console.error);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/sipgateIO.png')}
        />
        <LogoutButton title="Logout" onPress={logout} />
      </View>
      <Text style={styles.title}>Fax History</Text>
      <FlatList
        data={history}
        renderItem={({item}) => renderHistoryItem(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 32,
    marginTop: 32,
  },
  bold: {
    fontWeight: 'bold',
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
  item: {
    padding: 8,
  },
});
