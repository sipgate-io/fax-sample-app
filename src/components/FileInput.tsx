import React, {useRef} from 'react';
import {Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {fileIcon} from '../assets/icons';

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
  const fakeButton = useRef<HTMLInputElement>(null);

  return (
    <TouchableOpacity
      onPress={() => fakeButton.current?.click()}
      style={styles.touchable}>
      <Image style={styles.img} source={fileIcon} />
      <Text numberOfLines={1} style={styles.text}>
        {file ? file.name : 'Select File'}
      </Text>
      <input
        onChange={async (event) => {
          const files = event.target.files!;
          const htmlFile = files[0]!;
          const buffer = {} as Buffer; //;await htmlFile.arrayBuffer();
          const file = {
            name: htmlFile.name,
            size: htmlFile.size,
            uri: htmlFile.name,
            buffer,
          };
          onPress(file);
        }}
        ref={fakeButton}
        type="file"
        style={{display: 'none'}}
      />
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
