import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface Props {
  color: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title: string;
}

const Button = ({color, title, onPress, style}: Props) => {
  let colorStyle: StyleSheet.NamedStyles<any> =
    color === 'primary' ? primaryStyles : secondaryStyles;
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      style={[styles.touchable, style, colorStyle.touchable]}>
      <Text style={[styles.text, colorStyle.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    //padding: 12,
    height: 32,
    width: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  text: {
    fontSize: 16,
  },
});

const primaryStyles = StyleSheet.create({
  touchable: {
    backgroundColor: 'white',
    borderColor: 'black',
  },

  text: {
    color: 'black',
  },
});

const secondaryStyles = StyleSheet.create({
  touchable: {
    backgroundColor: 'black',
    borderColor: 'black',
  },

  text: {
    color: 'white',
  },
});

export default Button;
