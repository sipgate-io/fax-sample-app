import React, { PropsWithChildren } from "react";

import { StyleSheet, Dimensions, View, Image, ImageProps } from "react-native";

type Props = PropsWithChildren<ImageProps>;

export const BackgroundImage = ({ source, children, ...rest }: Props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={source} {...rest} />
      <View style={styles.children}>{children}</View>
    </View>
  );
};

const imageAspectRatio = 750 / 354;
const scaledWidth = Dimensions.get("window").width;
const scaledHeight = scaledWidth / imageAspectRatio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",

    position: "relative",
  },
  children: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
  image: {
    width: scaledWidth,
    height: scaledHeight,
    resizeMode: "contain",
    position: "relative",
  },
});
