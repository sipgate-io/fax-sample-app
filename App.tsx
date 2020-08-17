import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Logo from "./components/images/Logo";
import Input from "./components/Input";
import SubmitButton from "./components/SubmitButton";
import FileInput from "./components/FileInput";

export default function App() {
  const [file, setFile] = useState<{} | null>(null);

  const choosePdf = () => {
    setFile({});
  };

  const submit = () => alert("submitted");

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
      <View style={styles.buttons}>
        <FileInput onPress={choosePdf} />
        <SubmitButton
          style={{ marginTop: "2rem" }}
          disabled={file === null}
          onPress={submit}
        />
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
  buttons: {
    marginTop: "2rem",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
