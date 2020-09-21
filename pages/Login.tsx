import React, {useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

import {sipgateIO, createSettingsModule} from 'sipgateio';
import {sipgateIOLogo} from '../assets/images';

async function attemptLogin(username: string, password: string) {
  const sipgateio = sipgateIO({
    username,
    password,
  });
  const settings = createSettingsModule(sipgateio);
  await settings.getWebhookSettings();
}

interface Props {
  login: (username: string, password: string) => void;
}

export default function Login({login}: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    setIsLoading(true);
    attemptLogin(username, password)
      .then(() => login(username, password))
      .catch(setError)
      .finally(() => setIsLoading(true));
  };

  const setError = (error: Error) => {
    if (error.message === 'Unauthorized') {
      setErrorMessage('There is no sipgate account with these credentials.');
    } else if (error.message.startsWith('Invalid email')) {
      setErrorMessage('This email is invalid.');
    } else {
      setErrorMessage('Ups. An error occurred: ' + error.message);
    }
  };

  return (
    <View>
      <Text style={styles.header}>Log in</Text>
      <Text style={styles.description}>
        Log in to your sipgate basic, simquadrat or sipgate team account.
      </Text>

      <Input
        style={styles.input}
        placeholder="E-Mail"
        value={username}
        onChangeText={setUsername}
        error={errorMessage !== null}
        autoCompleteType="username"
      />
      <Input
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        error={errorMessage !== null}
        secureTextEntry
        autoCompleteType="password"
      />
      <View style={styles.errorTextContainer}>
        {errorMessage ? (
          <Image
            source={require('../assets/icons/exclamation_mark.png')}
            style={styles.exclamationMark}
          />
        ) : undefined}
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>

      <View style={styles.submitButtonContainer}>
        <SubmitButton
          onPress={submit}
          title="Login"
          loading={isLoading}
          disabled={username === '' || password === '' || isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    marginTop: 32,
  },
  description: {
    marginTop: 16,
  },
  input: {
    marginTop: 32,
  },
  errorTextContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '80%',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff0000',
    minHeight: 1,
  },
  submitButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  exclamationMark: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
});
