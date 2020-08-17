import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

const Input = (props: TextInputProps) => {
  return <TextInput {...props} style={[styles.input, props.style]} />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#6a6a6a",
    borderBottomWidth: 1.5,
    padding: 8,
    fontFamily: "Px-Grotesk",
  },
});

export default Input;
