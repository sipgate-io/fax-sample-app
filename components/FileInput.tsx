import React from "react";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export interface PickedFile {
  name: string;
  size: number;
  uri: string;
  lastModified?: number;
  file?: File;
  output?: FileList | null;
}

export interface Props {
  onPress?: (e: PickedFile) => void;
  file?: PickedFile;
}

const FileChooser = ({ file, onPress }: Props) => {
  const onPressInner = () => {
    const options = { type: "application/pdf" };
    DocumentPicker.getDocumentAsync(options).then((result) => {
      if (result.type === "success" && onPress) onPress(result);
    });
  };
  return (
    <TouchableOpacity onPress={onPressInner} style={styles.touchable}>
      <Image style={styles.img} source={require("../assets/fileIcon.png")} />
      <Text numberOfLines={1} style={styles.text}>
        {file ? file.name : "Datei auswählen"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: 10,
    borderWidth: 2,
    width: 11 * 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontFamily: "Px-Grotesk",
  },
  img: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});

export default FileChooser;
