import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Image, Text, View, ImageBackground } from "react-native";
import { useFonts } from "expo-font";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import FileInput, { PickedFile } from "../components/FileInput";

export default function Main() {
  let [fontsLoaded] = useFonts({
    "Px-Grotesk": require("../assets/fonts/PxGroteskRegular.ttf"),
    "Px-Grotesk-Bold": require("../assets/fonts/PxGroteskBold.ttf"),
  });

  const [file, setFile] = useState<PickedFile | null>(null);

  if (!fontsLoaded) {
    return null;
  }

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