import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import FileInput, { PickedFile } from "../components/FileInput";
import { Credentials } from "../App";
import { createFaxModule, sipgateIO, Fax } from "sipgateio";
import { Buffer } from "buffer";
import { readFile } from "../utils/files";

function sendFax(credentials: Credentials, fax: Fax): Promise<string> {
  const client = sipgateIO(credentials);
  const faxModule = createFaxModule(client);
  return faxModule.send(fax).then((res) => res.sessionId);
}

interface Props {
  credentials: Credentials;
}

export default function Main({ credentials }: Props) {
  const [recipient, setRecipient] = useState<string | undefined>("");
  const [file, setFile] = useState<PickedFile | null>(null);

  const submit = async () => {
    if (!file) return alert("no file set");
    if (!recipient) return alert("no recipient set");

    let buffer;
    if (file.file) {
      // only on browser
      buffer = new Buffer(await file.file.arrayBuffer());
    } else {
      buffer = await readFile(file.uri);
    }

    const fax: Fax = {
      to: recipient,
      fileContent: buffer,
      filename: file?.name,
      faxlineId: "f0",
    };

    await sendFax(credentials, fax)
      .then(() => setFile(null))
      .catch(console.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fax Machine</Text>
      <Text style={styles.description}>
        Select a <Text style={styles.bold}>PDF-File</Text> in{" "}
        <Text>A4 Format </Text> and send a fax to the number of your choosing.
      </Text>
      <View style={styles.input}>
        <Input
          keyboardType="phone-pad"
          placeholder="Faxnummer"
          onChangeText={setRecipient}
          value={recipient}
          icon={require("../assets/icons/contacts.png")}
          onIconClick={() => alert("contact selection")}
        />
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
