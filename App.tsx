import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";

import Main from "./pages/Main";
import Login from "./pages/Login";
import { StyleSheet, View } from "react-native";

import { useAsyncStorage } from "@react-native-community/async-storage";
import { LOGIN_KEY } from "./storage/keys";

export interface Credentials {
  username: string;
  password: string;
}

export default function App() {
  const [fontsLoaded, error] = useFonts({
    "Px-Grotesk": require("./assets/fonts/PxGroteskRegular.ttf"),
    "Px-Grotesk-Bold": require("./assets/fonts/PxGroteskBold.ttf"),
  });

  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

  const { setItem, getItem } = useAsyncStorage(LOGIN_KEY);

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

  return (
    <View style={styles.container}>
      {credentials === null && <Login login={login} />}
      {credentials && <Main credentials={credentials} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    padding: 32,

    // TODO: doesn't work in android
    backgroundImage: `url(${require("./assets/background.png")})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
  },
});
