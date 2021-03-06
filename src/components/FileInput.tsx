import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';

import {Buffer} from 'buffer';

import DocumentPicker from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import {fileIcon} from '../../assets/icons';

export interface PickedFile {
  name: string;
  size: number;
  uri: string;
  buffer: Buffer;
}

export interface Props {
  onPress: (e: PickedFile) => void;
  file?: PickedFile;
}

const FileChooser = ({file, onPress}: Props) => {
  const onPressInner = async () => {
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    })
      .then((res) => {
        RNFS.readFile(res.uri, 'base64').then((fileAsBase64) => {
          const buffer = new Buffer(fileAsBase64, 'base64');
          onPress({
            name: res.name,
            size: res.size,
            uri: res.uri,
            buffer: buffer,
          });
        });
      })
      .catch((err) => {
        if (!DocumentPicker.isCancel(err)) {
          Alert.alert('Error', err.message);
        }
      });
  };

  return (
    <TouchableOpacity onPress={onPressInner} style={styles.touchable}>
      <Image style={styles.img} source={fileIcon} />
      <Text numberOfLines={1} style={styles.text}>
        {file ? file.name : 'Select File'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    padding: 10,
    height: 48,
    borderWidth: 2,
    width: 11 * 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
  },
  img: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

export default FileChooser;
