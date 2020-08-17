import React from "react";
import {
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
} from "react-native";
import FileImage from "./images/FileImage";

export interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const FileChooser = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.touchable]}>
      <FileImage />
      <Text style={styles.text}>Datei auswählen</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: "0.6rem",
    borderWidth: 2,
    width: "10rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
  },
});

export default FileChooser;
