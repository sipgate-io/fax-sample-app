import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Image, View } from "react-native";

import Main from "./pages/Main";
import Login from "./pages/Login";

import { useAsyncStorage } from "@react-native-community/async-storage";
import { LOGIN_KEY } from "./storage/keys";
import { BackgroundImage } from "./components/BackgroundImage";

import { Buffer } from "buffer";
import { StatusBar } from "expo-status-bar";

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
        <StatusBar style="auto" />
        <Image
          style={styles.logo}
          source={require("./assets/images/sipgateIO.png")}
        />
        {credentials === null && <Login login={login} />}
        {credentials && <Main credentials={credentials} />}
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 8 * 16,
    height: 4 * 16,
    resizeMode: "contain",
  },
});
