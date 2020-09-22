import React, {PropsWithChildren, useEffect, useState} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  ImageProps,
  Keyboard,
} from 'react-native';

type Props = PropsWithChildren<ImageProps>;

export const BackgroundImage = ({source, children, ...rest}: Props) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const didShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const didHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });
    return () => {
      didShow.remove();
      didHide.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      <Image
        style={[styles.image, {display: keyboardOpen ? 'none' : undefined}]}
        source={source}
        {...rest}
      />
    </View>
  );
};

const imageAspectRatio = 415 / 155;
const scaledWidth = Dimensions.get('window').width;
const scaledHeight = scaledWidth / imageAspectRatio;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  children: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: scaledWidth,
    height: scaledHeight,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
});
