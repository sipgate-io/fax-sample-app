import React, { useState } from "react";
import { View } from "react-native";
import Input from "../components/Input";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <View>
      <Input value={username} onChangeText={setUsername} />
      <Input value={password} onChangeText={setPassword} />
    </View>
  );
}
