import React from "react";
import {
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface Props {
  disabled?: boolean;
  style: StyleProp<ViewStyle>;
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const SubmitButton = ({ onPress, style, disabled }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.touchable,
        { backgroundColor: disabled ? "#bfbfbf" : "black" },
        style,
      ]}
    >
      <Text style={styles.text}>Senden</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: 12,
    width: 11 * 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    color: "white",
    fontFamily: "Px-Grotesk",
  },
});

export default SubmitButton;
