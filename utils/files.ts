import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export const readFile = async (uri: string): Promise<Buffer> => {
  // apparently, expo cannot read a binary file's contents,
  // so we read a base64 string and decode it afterwards
  let s = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  return new Buffer(s, "base64");
};
