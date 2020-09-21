import React from 'react';
import {
  TextInput,
  Image,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

interface Props extends TextInputProps {
  onIconClick?: () => void;
  icon?: ImageSourcePropType;
  error?: boolean;
}

const Input = ({error, onIconClick, icon, ...rest}: Props) => {
  let inputStyles = [styles.input, rest.style];
  if (error) inputStyles.push(styles.error);

  return (
    <View style={styles.container}>
      <TextInput {...rest} style={inputStyles} />
      {icon && (
        <TouchableOpacity
          onPress={() => onIconClick && onIconClick()}
          style={styles.iconContainer}>
          <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    borderColor: '#6a6a6a',
    borderBottomWidth: 1.5,
    padding: 8,
  },
  error: {
    borderColor: '#ff0000',
  },
  icon: {
    width: 16,
    height: 16,
    margin: 'auto',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    padding: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;
