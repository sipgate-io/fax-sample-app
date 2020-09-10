import React from 'react';
import {
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface Props {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title: string;
}

const LogoutButton = ({title, onPress, style}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      style={[styles.touchable, style]}>
      <Text style={styles.text}>{title}</Text>
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
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
  },

  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default LogoutButton;
