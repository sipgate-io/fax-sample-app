import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

import { sipgateIO, createSettingsModule, createFaxModule } from "sipgateio";

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

export default function Login({ login }: Props) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    attemptLogin(username, password)
      .then(() => login(username, password))
      .catch((e) => setErrorMessage(e.message));
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
      />
      <Input
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        error={errorMessage !== null}
      />
      <View style={styles.errorTextContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>

      <View style={styles.submitButtonContainer}>
        <SubmitButton onPress={submit} title="Login" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    marginTop: 32,
    fontFamily: "Px-Grotesk-Bold",
  },
  description: {
    marginTop: 16,
    fontFamily: "Px-Grotesk",
  },
  input: {
    marginTop: 32,
  },
  errorTextContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  errorText: {
    color: "#ff0000",
    minHeight: 1,
  },
  submitButtonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
});
