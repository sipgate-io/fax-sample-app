import React from "react";
import { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = () => {
  const [value, onChangeText] = useState<string>("");

  return (
    <TextInput
      style={styles.input}
      keyboardType="phone-pad"
      placeholder="Faxnummer"
      onChangeText={(text) => onChangeText(text)}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#6a6a6a",
    borderBottomWidth: 1.5,
    padding: "0.5rem",
  },
});

export default Input;
