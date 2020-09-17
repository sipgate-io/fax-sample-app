import React, {useEffect, useMemo, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import Button from '../components/Button';
import {
  SipgateIOClient,
  FaxHistoryEntry,
  createHistoryModule,
  HistoryDirection,
  HistoryEntryType,
  FaxStatus,
  FaxStatusType,
} from 'sipgateio';
import {contactsIcon} from '../assets/icons';

interface Props {
  client: SipgateIOClient;
  logout: () => void;
}

interface FaxStatusIndicator {
  text: string;
  icon: any;
}

const getFaxStatusIndicator = (status: FaxStatusType): FaxStatusIndicator => {
  return {
    [FaxStatusType.FAILED]: {
      text: 'failed to send at',
      icon: contactsIcon,
    },
    [FaxStatusType.PENDING]: {
      text: 'pending since',
      icon: contactsIcon,
    },
    [FaxStatusType.SCHEDULED]: {
      text: 'scheduled for',
      icon: contactsIcon,
    },
    [FaxStatusType.SENDING]: {
      text: 'sending since',
      icon: contactsIcon,
    },
    [FaxStatusType.SENT]: {
      text: 'successfully sent at',
      icon: contactsIcon,
    },
  }[status];
};

function renderHistoryItem(item: FaxHistoryEntry) {
  const target = item.targetAlias || item.target;
  const faxStatusIndicator = getFaxStatusIndicator(item.faxStatus);

  const sentDate = `${item.created.toLocaleDateString()} | ${item.created.toLocaleTimeString()}`;
  const lastModifiedDate = `${item.lastModified.getHours()}:${item.lastModified.getMinutes()}`;

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyItemLeft}>
        <Text style={styles.historyItemRecipient}>To: {target}</Text>
        <Text style={styles.historyItemCreatedDate}>{sentDate}</Text>
      </View>
      <View style={styles.historyItemRight}>
        <View style={styles.faxStatusIndicator}>
          <Text style={styles.faxStatusIndicatorText}>
            {faxStatusIndicator.text}
          </Text>
          <Text style={styles.faxStatusIndicatorText}>{lastModifiedDate}</Text>
        </View>
        <Image
          style={styles.faxStatusIndicatorIcon}
          source={faxStatusIndicator.icon}
        />
      </View>
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
      <Text style={styles.title}>Fax History</Text>
      <FlatList
        style={styles.historyList}
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
  historyList: {
    height: 300,
  },
  historyItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  historyItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  historyItemRecipient: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyItemCreatedDate: {
    fontSize: 10,
  },

  historyItemRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  faxStatusIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  faxStatusIndicatorText: {
    color: '#333344',
    fontSize: 10,
  },
  faxStatusIndicatorIcon: {
    marginLeft: 4,
    width: 32,
    height: 32,
  },
});
