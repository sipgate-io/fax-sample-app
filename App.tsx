import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";

import Main from "./pages/Main";
import Login from "./pages/Login";
import { View } from "react-native";

import { useAsyncStorage } from "@react-native-community/async-storage";
import { LOGIN_KEY } from "./storage/keys";
import { BackgroundImage } from "./components/BackgroundImage";

import { Buffer } from "buffer";

global.Buffer = Buffer;

export interface Credentials {
  username: string;
  password: string;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Px-Grotesk": require("./assets/fonts/PxGroteskRegular.ttf"),
    "Px-Grotesk-Bold": require("./assets/fonts/PxGroteskBold.ttf"),
  });

  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

  const { setItem, getItem, removeItem } = useAsyncStorage(LOGIN_KEY);

  useEffect(() => {
    getItem()
      .then((value) => (value ? JSON.parse(value) : null))
      .then(setCredentials);
  }, []);

  const login = (username: string, password: string) => {
    const credentials = { username, password };
    setItem(JSON.stringify(credentials));
    setCredentials(credentials);
  };

  if (!fontsLoaded) return null;

  return (
    <BackgroundImage source={require("./assets/background.png")}>
      <View style={{ padding: 32 }}>
        {credentials === null && <Login login={login} />}
        {credentials && <Main credentials={credentials} />}
      </View>
    </BackgroundImage>
  );
}
