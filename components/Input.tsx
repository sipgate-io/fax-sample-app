import React from "react";
import {
  TextInput,
  Image,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

interface Props extends TextInputProps {
  onIconClick?: () => void;
  icon?: ImageSourcePropType;
}

const Input = ({ onIconClick, icon, ...rest }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput {...rest} style={[styles.input, rest.style]} />
      {icon && (
        <TouchableOpacity
          onPress={() => onIconClick && onIconClick()}
          style={styles.iconContainer}
        >
          <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    borderColor: "#6a6a6a",
    borderBottomWidth: 1.5,
    padding: 8,
    fontFamily: "Px-Grotesk",
  },
  icon: {
    width: 24,
    height: 24,
    margin: "auto",
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",
  },
});

export default Input;
