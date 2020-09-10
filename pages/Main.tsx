import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native';

import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import FileInput, {PickedFile} from '../components/FileInput';
import {createFaxModule, sipgateIO, Fax} from 'sipgateio';
import {selectContact} from 'react-native-select-contact';
import LogoutButton from '../components/LogoutButton';
import {SipgateIOClient} from 'sipgateio/dist/core';
import DropDown from '../components/DropDown';
import {FaxlineResponse} from './Login';

function sendFax(client: SipgateIOClient, fax: Fax): Promise<string> {
  const faxModule = createFaxModule(client);
  return faxModule.send(fax).then((res) => res.sessionId);
}

interface Props {
  client: SipgateIOClient;
  logout: () => void;
  faxlines: FaxlineResponse[];
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
  const defaultMessage =
    statusMessage.status === SendFaxStatus.SUCCESS
      ? 'Your fax has been queued'
      : statusMessage.status === SendFaxStatus.ERROR
      ? 'Something went wrong'
      : undefined;

  return statusMessage.message
    ? `${defaultMessage}: ${statusMessage.message}`
    : `${defaultMessage}.`;
}

function sanitizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export default function Main({client, logout, faxlines}: Props) {
  const [recipient, setRecipient] = useState<string>();
  const [file, setFile] = useState<PickedFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [faxline, setFaxline] = useState<string>(faxlines[0]?.id ?? '');

  const [statusMessage, setStatusMessage] = useState<StatusMessage>();

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
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      .then((status) => {
        if (status !== 'granted') {
          return;
        }

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
      })
      .catch(console.error);
  };

  const messageImage =
    statusMessage?.status === SendFaxStatus.SUCCESS
      ? require('../assets/icons/success.png')
      : statusMessage?.status === SendFaxStatus.ERROR
      ? require('../assets/icons/exclamation_mark.png')
      : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/sipgateIO.png')}
        />
        <LogoutButton title="Logout" onPress={logout} />
      </View>
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
          icon={require('../assets/icons/contacts.png')}
          onIconClick={pickContact}
        />
        <DropDown
          selected={faxline}
          onChange={setFaxline}
          items={faxlines.map((line) => {
            return {label: line.alias, value: line.id};
          })}
        />
      </View>
      <View style={styles.buttons}>
        <FileInput
          onPress={(newFile) => {
            setStatusMessage(undefined);
            setFile(newFile);
          }}
          file={file}
        />
        <SubmitButton
          title="Senden"
          style={{marginTop: 16}}
          loading={isLoading}
          disabled={!file || !recipient || isLoading}
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
});
