import React, {useEffect, useMemo, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import Button from '../components/Button';
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

function renderHistoryItem(item: FaxHistoryEntry) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.item}>{item.created.toLocaleDateString()}</Text>
      <Text style={styles.item}>{item.faxStatus}</Text>
    </View>
  );
}

export default function History({client, logout}: Props) {
  const [history, setHistory] = useState<FaxHistoryEntry[]>();
  const historyModule = useMemo(() => createHistoryModule(client), [client]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    fetchFaxHistoryEntries()
      .catch(Alert.alert)
      .finally(() => setRefreshing(false));
  };

  function fetchFaxHistoryEntries(): Promise<void> {
    return historyModule
      .fetchAll({
        types: [HistoryEntryType.FAX],
        directions: [HistoryDirection.OUTGOING],
      })
      .then((historyEntries) =>
        setHistory(historyEntries as FaxHistoryEntry[]),
      );
  }

  useEffect(() => {
    fetchFaxHistoryEntries();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/sipgateIO.png')}
        />
        <Button title="Logout" onPress={logout} />
      </View>
      <Text style={styles.title}>Fax History</Text>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
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
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
});
