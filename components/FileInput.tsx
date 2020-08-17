import React from "react";
import {
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
} from "react-native";
import FileImage from "./images/FileImage";
import * as DocumentPicker from "expo-document-picker";
import { DocumentResult } from "expo-document-picker";

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
    <TouchableOpacity onPress={onPressInner} style={[styles.touchable]}>
      <FileImage />
      <Text numberOfLines={1} style={styles.text}>
        {file ? file.name : "Datei auswählen"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: "0.6rem",
    borderWidth: 2,
    width: "11rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontFamily: "Px-Grotesk",
  },
});

export default FileChooser;
