import React, {useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

import {sipgateIO} from 'sipgateio';
import {exclamationMarkIcon} from '../../assets/icons';

async function attemptLogin(tokenId: string, token: string) {
  const sipgateio = sipgateIO({
    token,
    tokenId,
  });
  await sipgateio.getAuthenticatedWebuserId();
}

interface Props {
  login: (username: string, password: string) => void;
}

export default function Login({login}: Props) {
  const [tokenId, setTokenId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    setIsLoading(true);
    attemptLogin(tokenId, token)
      .then(() => login(tokenId, token))
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  const setError = (error: Error) => {
    if (error.message === 'Unauthorized') {
      setErrorMessage('There is no sipgate account with these credentials.');
    } else {
      setErrorMessage('Ups. An error occurred: ' + error.message);
    }
  };

  return (
    <View>
      <Text style={styles.header}>Log in</Text>
      <Text style={styles.description}>
        Log in with your sipgate Personal-Access-Token.
      </Text>

      <Input
        style={styles.input}
        placeholder="Token-ID"
        value={tokenId}
        onChangeText={setTokenId}
        error={errorMessage !== null}
        autoCompleteType="off"
      />
      <Input
        style={styles.input}
        placeholder="Token"
        value={token}
        onChangeText={setToken}
        error={errorMessage !== null}
        secureTextEntry
        autoCompleteType="off"
      />
      <View style={styles.errorTextContainer}>
        {errorMessage ? (
          <Image source={exclamationMarkIcon} style={styles.exclamationMark} />
        ) : undefined}
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>

      <View style={styles.submitButtonContainer}>
        <SubmitButton
          onPress={submit}
          title="Login"
          loading={isLoading}
          disabled={tokenId === '' || token === '' || isLoading}
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
