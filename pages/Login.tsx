import React, { useState } from "react";
import { View } from "react-native";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

import { sipgateIO, createSettingsModule } from "sipgateio";

async function attemptLogin(username: string, password: string) {
  const sipgateio = sipgateIO({
    username,
    password,
  });
  const settings = createSettingsModule(sipgateio);
  const response = await settings.getWebhookSettings();
  if (response instanceof Error) throw response;
}

interface Props {
  login: (username: string, password: string) => void;
}

export default function Login({ login }: Props) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = () => {
    attemptLogin(username, password)
      .then(() => login(username, password))
      .catch((e) => alert(e.message));
  };

  return (
    <View>
      <Input placeholder="E-Mail" value={username} onChangeText={setUsername} />
      <Input
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
      />

      <SubmitButton style={{ marginTop: 16 }} onPress={submit} title="Login" />
    </View>
  );
}
