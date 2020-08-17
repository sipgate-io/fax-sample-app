import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Logo from "./components/Logo";
import Input from "./components/Input";

export default function App() {
  console.log();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Logo />
      </View>
      <Text style={styles.header}>Fax Machine</Text>
      <Text style={styles.description}>
        Select a <b>PDF-File</b> in <b>A4 Format </b> and send a fax to the
        number of your choosing.
      </Text>
      <View style={styles.input}>
        <Input />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    padding: "2rem",

    backgroundImage: `url(${require("./assets/background.png")})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
  },
  logo: {
    width: "8rem",
  },
  header: {
    fontWeight: "bold",
    fontSize: 32,
    marginTop: "2rem",
  },
  description: {
    marginTop: "1rem",
  },
  input: {
    marginTop: "1.5rem",
    width: "100%",
  },
});
