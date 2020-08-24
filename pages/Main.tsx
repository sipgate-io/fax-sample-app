import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Image, Text, View } from "react-native";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import FileInput, { PickedFile } from "../components/FileInput";
import { Credentials } from "../App";

interface Props {
  credentials: Credentials;
}

export default function Main({ credentials }: Props) {
  const [file, setFile] = useState<PickedFile | null>(null);

  const submit = () => {
    alert("submitted");
    setFile(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.logo} source={require("../assets/sipgate_io.png")} />
      <Text style={styles.header}>Fax Machine</Text>
      <Text style={styles.description}>
        Select a <Text style={styles.bold}>PDF-File</Text> in{" "}
        <Text>A4 Format </Text> and send a fax to the number of your choosing.
      </Text>
      <View style={styles.input}>
        <Input keyboardType="phone-pad" placeholder="Faxnummer" />
      </View>
      <View style={styles.buttons}>
        <FileInput onPress={setFile} file={file ?? undefined} />
        <SubmitButton
          title="Senden"
          style={{ marginTop: 16 }}
          disabled={file === null}
          onPress={submit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  logo: {
    width: 8 * 16,
    height: 4 * 16,
    resizeMode: "contain",
  },
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
    marginTop: 24,
    width: "100%",
  },
  buttons: {
    marginTop: 32,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});
