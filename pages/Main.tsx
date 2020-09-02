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
import {Credentials} from '../App';
import {createFaxModule, sipgateIO, Fax} from 'sipgateio';
import {selectContact} from 'react-native-select-contact';
import LogoutButton from '../components/LogoutButton';

function sendFax(credentials: Credentials, fax: Fax): Promise<string> {
  const client = sipgateIO(credentials);
  const faxModule = createFaxModule(client);
  return faxModule.send(fax).then((res) => res.sessionId);
}

interface Props {
  credentials: Credentials;
  logout: () => void;
}

enum Message {
  SUCCESS = 'Your fax was sent.',
  ERROR = 'Something went wrong.',
}

export default function Main({credentials, logout}: Props) {
  const [recipient, setRecipient] = useState<string | null>(null);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<Message | undefined>(undefined);

  const submit = async () => {
    const fax: Fax = {
      to: recipient!,
      fileContent: file!.buffer,
      filename: file!.name,
      faxlineId: 'f11',
    };

    setIsLoading(true);
    await sendFax(credentials, fax)
      .then(() => {
        setFile(null);
        setMessage(Message.SUCCESS);
      })
      .catch(() => setMessage(Message.ERROR))
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
            Alert.alert('no fax number belongs to this contact');
            setRecipient(null);
            return;
          }
          setMessage(undefined);
          setRecipient(firstFaxNumber.number);
        });
      })
      .catch(console.error);
  };

  const messageImage =
    message === Message.SUCCESS
      ? require('../assets/icons/success.png')
      : message === Message.ERROR
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
        Select a <Text style={styles.bold}>PDF-File</Text> in{' '}
        <Text>A4 Format </Text> and send a fax to the number of your choosing.
      </Text>
      <View style={styles.input}>
        <Input
          keyboardType="phone-pad"
          placeholder="Faxnummer"
          onChangeText={(text) => {
            setMessage(undefined);
            setRecipient(text);
          }}
          value={recipient}
          icon={require('../assets/icons/contacts.png')}
          onIconClick={pickContact}
        />
      </View>
      <View style={styles.buttons}>
        <FileInput
          onPress={(newFile) => {
            setMessage(undefined);
            setFile(newFile);
          }}
          file={file ?? undefined}
        />
        <SubmitButton
          title="Senden"
          style={{marginTop: 16}}
          loading={isLoading}
          disabled={file === null || recipient === '' || isLoading}
          onPress={submit}
        />
        <View style={styles.messageContainer}>
          <Image style={styles.messageImage} source={messageImage}></Image>
          <Text
            style={{
              color: message === Message.ERROR ? 'red' : 'green',
            }}>
            {message}
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
