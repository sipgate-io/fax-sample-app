import React from "react";
import { useFonts } from "expo-font";

import Main from "./pages/Main";
import Login from "./pages/Login";
import { StyleSheet, View } from "react-native";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Px-Grotesk": require("./assets/fonts/PxGroteskRegular.ttf"),
    "Px-Grotesk-Bold": require("./assets/fonts/PxGroteskBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Main />
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
