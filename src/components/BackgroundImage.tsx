import React, {PropsWithChildren} from 'react';

import {StyleSheet, Dimensions, View, Image, ImageProps} from 'react-native';

type Props = PropsWithChildren<ImageProps>;

export const BackgroundImage = ({source, children, ...rest}: Props) => {
  return (
    <View style={styles.container}>
      <View>{children}</View>
      <Image style={styles.image} source={source} {...rest} />
    </View>
  );
};

const imageAspectRatio = 415 / 155;
const scaledWidth = Dimensions.get('window').width;
const scaledHeight = scaledWidth / imageAspectRatio;

const styles = StyleSheet.create({
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: scaledHeight,
    resizeMode: 'contain',
  },
});
