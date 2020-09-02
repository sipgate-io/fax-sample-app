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

export default function Main({credentials, logout}: Props) {
  const [recipient, setRecipient] = useState<string | null>(null);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submit = async () => {
    if (!file) return alert('no file set');
    if (!recipient) return alert('no recipient set');

    const fax: Fax = {
      to: recipient,
      fileContent: file.buffer,
      filename: file?.name,
      faxlineId: 'f0',
    };

    setIsLoading(true);
    await sendFax(credentials, fax)
      .then(() => setFile(null))
      .catch(console.error)
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

          setRecipient(firstFaxNumber.number);
        });
      })
      .catch(console.error);
  };

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
          onChangeText={setRecipient}
          value={recipient}
          icon={require('../assets/icons/contacts.png')}
          onIconClick={pickContact}
        />
      </View>
      <View style={styles.buttons}>
        <FileInput onPress={setFile} file={file ?? undefined} />
        <SubmitButton
          title="Senden"
          style={{marginTop: 16}}
          loading={isLoading}
          disabled={file === null || recipient === '' || isLoading}
          onPress={submit}
        />
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
});
