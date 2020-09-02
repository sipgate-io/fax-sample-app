import React from 'react';
import {
  Image,
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
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  title: string;
  loading?: boolean;
}

const SubmitButton = ({title, onPress, style, disabled, loading}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.touchable,
        {backgroundColor: disabled && !loading ? '#bfbfbf' : 'black'},
        style,
      ]}>
      {loading ? (
        <Image
          style={{width: 24, height: 24}}
          source={require('../assets/animations/loading_animation_button.gif')}
        />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: 12,
    height: 48,
    width: 11 * 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default SubmitButton;
