import * as React from "react";
import Svg, { Defs, Path } from "react-native-svg";
import { StyleSheet } from "react-native";
/* SVGR has dropped some elements not supported by react-native-svg: style */

function FileImage() {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 14 18">
      <Defs></Defs>
      <Path d="M.5 2.5v15h11m-9-17h7l4 4v11h-11z" />
      <Path d="M9.5.5v4h4" />
      <Path d="M4.5 3.5h3M4.5 6.5h7M4.5 9.5h7M4.5 12.5h7" />
    </Svg>
  );
}

export default FileImage;
