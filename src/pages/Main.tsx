import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Image,
  Platform,
} from 'react-native';

import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import FileInput, {PickedFile} from '../components/FileInput';
import {createFaxModule, Fax} from 'sipgateio';
import {selectContact} from 'react-native-select-contact';
import {SipgateIOClient} from 'sipgateio/dist/core';
import DropDown from '../components/DropDown';
import {
  contactsIcon,
  exclamationMarkIcon,
  successIcon,
} from '../../assets/icons';
import {getAuthenticatedWebuser} from 'sipgateio/dist/core/helpers/authorizationInfo';

export interface Faxline {
  id: string;
  alias: string;
  tagline: string;
  canSend: boolean;
  canReceive: boolean;
}

interface FaxlinesResponse {
  items: Faxline[];
}

export async function getUserFaxlines(
  client: SipgateIOClient,
): Promise<Faxline[]> {
  const webuserId = await getAuthenticatedWebuser(client);
  return await client
    .get<FaxlinesResponse>(`${webuserId}/faxlines`)
    .then((response) => response.items);
}

function sendFax(client: SipgateIOClient, fax: Fax): Promise<string> {
  const faxModule = createFaxModule(client);
  return faxModule.send(fax).then((res) => res.sessionId);
}

interface Props {
  client: SipgateIOClient;
}

interface StatusMessage {
  status: SendFaxStatus;
  message?: string;
}

enum SendFaxStatus {
  SUCCESS,
  ERROR,
}

function getStatusMessageDisplayText(statusMessage: StatusMessage): string {
  return statusMessage.status === SendFaxStatus.SUCCESS
    ? 'Your fax has been queued.'
    : statusMessage.status === SendFaxStatus.ERROR
    ? 'Something went wrong.'
    : undefined;
}

function sanitizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export default function Main({client}: Props) {
  const [recipient, setRecipient] = useState<string>();
  const [file, setFile] = useState<PickedFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [faxlines, setFaxlines] = useState<Faxline[]>([]);
  const [faxline, setFaxline] = useState<string>('');

  const [statusMessage, setStatusMessage] = useState<StatusMessage>();

  useEffect(() => {
    getUserFaxlines(client)
      .then(setFaxlines)
      .catch((error) =>
        Alert.alert(
          'Error',
          'An error occurred while fetching the available fax lines!',
        ),
      );
  }, []);

  const submit = async () => {
    const fax: Fax = {
      to: sanitizePhoneNumber(recipient!),
      fileContent: file!.buffer,
      filename: file!.name,
      faxlineId: faxline,
    };

    setIsLoading(true);
    await sendFax(client, fax)
      .then(() => {
        setFile(undefined);
        setStatusMessage({status: SendFaxStatus.SUCCESS});
      })
      .catch((error) =>
        setStatusMessage({status: SendFaxStatus.ERROR, message: error.message}),
      )
      .finally(() => setIsLoading(false));
  };

  const pickContact = async () => {
    if (Platform.OS === 'ios') {
      return getFaxnumberFromContactPicker();
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        "You can't select a contact since you denied the permission.",
      );
      return;
    }

    return getFaxnumberFromContactPicker();
  };

  const getFaxnumberFromContactPicker = () => {
    return selectContact().then((contact) => {
      if (!contact) return;

      const faxNumbers = contact.phones.filter((phone) =>
        phone.type.toLowerCase().includes('fax'),
      );
      const firstFaxNumber = faxNumbers[0];

      if (!firstFaxNumber) {
        Alert.alert('No fax number belongs to this contact.');
        setRecipient(undefined);
        return;
      }
      setStatusMessage(undefined);
      setRecipient(firstFaxNumber.number);
    });
  };

  const messageImage =
    statusMessage?.status === SendFaxStatus.SUCCESS
      ? successIcon
      : statusMessage?.status === SendFaxStatus.ERROR
      ? exclamationMarkIcon
      : undefined;

  const faxlineDropDownItems = faxlines.map((line) => {
    return {label: line.alias, value: line.id};
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fax Machine</Text>
      <Text style={styles.description}>
        Select a <Text style={styles.bold}>PDF file</Text> in{' '}
        <Text>A4 format</Text> and send a fax to the number of your choice.
      </Text>
      <View style={styles.input}>
        <Input
          keyboardType="phone-pad"
          placeholder="Faxnummer"
          onChangeText={(text) => {
            setStatusMessage(undefined);
            setRecipient(text);
          }}
          value={recipient}
          icon={contactsIcon}
          onIconClick={pickContact}
        />
        <DropDown
          selected={faxline}
          onChange={setFaxline}
          items={faxlineDropDownItems}
          style={styles.faxlinePicker}
          placeholder="Select your fax line"
        />
      </View>
      <View style={styles.buttons}>
        <FileInput
          onPress={(newFile) => {
            setFaxStatus(undefined);
            setFile(newFile);
          }}
          file={file}
        />
        <SubmitButton
          title="Send"
          style={{marginTop: 16}}
          loading={isLoading}
          disabled={!file || !recipient || isLoading || !faxline}
          onPress={submit}
        />
        <View style={styles.messageContainer}>
          <Image style={styles.messageImage} source={messageImage} />
          <Text
            style={{
              color:
                statusMessage?.status === SendFaxStatus.ERROR
                  ? 'red'
                  : statusMessage?.status === SendFaxStatus.SUCCESS
                  ? 'green'
                  : undefined,
            }}>
            {statusMessage && getStatusMessageDisplayText(statusMessage)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 32,
    marginTop: 32,
  },
  description: {
    marginTop: 16,
  },
  input: {
    marginTop: 24,
    width: '100%',
  },
  buttons: {
    marginTop: 32,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  messageContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageImage: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  faxlinePicker: {
    marginTop: 20,
  },
});
