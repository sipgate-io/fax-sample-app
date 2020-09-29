import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SipgateIOClient,
  FaxHistoryEntry,
  createHistoryModule,
  HistoryDirection,
  HistoryEntryType,
  FaxStatusType,
} from 'sipgateio';
import {
  contactsIcon,
  failedIcon,
  pendingIcon,
  scheduledIcon,
  sendingIcon,
  sentIcon,
} from '../assets/icons';

interface Props {
  client: SipgateIOClient;
}

interface FaxStatusIndicator {
  text: string;
  icon: any;
}

const getFaxStatusIndicator = (status: FaxStatusType): FaxStatusIndicator => {
  return {
    [FaxStatusType.FAILED]: {
      text: 'failed to send at',
      icon: failedIcon,
    },
    [FaxStatusType.PENDING]: {
      text: 'pending since',
      icon: pendingIcon,
    },
    [FaxStatusType.SCHEDULED]: {
      text: 'scheduled for',
      icon: scheduledIcon,
    },
    [FaxStatusType.SENDING]: {
      text: 'sending since',
      icon: sendingIcon,
    },
    [FaxStatusType.SENT]: {
      text: 'successfully sent at',
      icon: sentIcon,
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
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.historyItemRecipient}>
          To: {target}
        </Text>
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

export default function History({client}: Props) {
  const dimensions = useWindowDimensions();
  const [history, setHistory] = useState<FaxHistoryEntry[]>();
  const historyModule = useMemo(() => createHistoryModule(client), [client]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    fetchFaxHistoryEntries().finally(() => setRefreshing(false));
  };

  function fetchFaxHistoryEntries(): Promise<void> {
    return historyModule
      .fetchAll({
        types: [HistoryEntryType.FAX],
        directions: [HistoryDirection.OUTGOING],
      })
      .then((historyEntries) => {
        setHistory([...historyEntries] as FaxHistoryEntry[]);
      })
      .catch((error) =>
        Alert.alert(
          'Error',
          'An error occurred while fetching the fax history!',
        ),
      );
  }

  useEffect(() => {
    fetchFaxHistoryEntries();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fax History</Text>
      <FlatList
        style={[styles.historyList, {height: dimensions.height / 2}]}
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
    marginTop: 8,
  },
  historyItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  historyItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  historyItemRecipient: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  historyItemCreatedDate: {
    fontSize: 10,
  },

  historyItemRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
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
    marginLeft: 8,
    width: 24,
    height: 24,
  },
});
