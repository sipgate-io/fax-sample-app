import React, {ReactText} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import {Picker} from '@react-native-community/picker';

interface DropDownItem {
  label: string;
  value: string;
}

interface Props {
  items: DropDownItem[];
  selected: string | undefined;
  onChange: (item: string) => void;
  style: ViewStyle;
  placeholder: string;
}

const DropDown = (props: Props) => {
  const faxlineLabel = props.items.find((item) => item.value === props.selected)
    ?.label;

  function renderWebPicker() {
    const items = [{label: props.placeholder, value: ''}, ...props.items];
    return (
      <View style={styles.androidPicker}>
        <Picker
          style={styles.androidPickerText}
          selectedValue={props.selected}
          onValueChange={(value: ReactText) => props.onChange(String(value))}>
          {items.map((item, index) => {
            return (
              <Picker.Item label={item.label} value={item.value} key={index} />
            );
          })}
        </Picker>
      </View>
    );
  }

  return <View style={props.style}>{renderWebPicker()}</View>;
};

export default DropDown;

const styles = StyleSheet.create({
  iosPicker: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: 32,
    borderBottomColor: '#6a6a6a',
    borderBottomWidth: 1.5,
    padding: 8,
  },
  iosPickerText: {
    color: 'black',
  },
  iosPickerUnselectedText: {
    color: '#a9a9a9',
  },
  androidPicker: {
    display: 'flex',
    width: '100%',
    borderBottomColor: '#6a6a6a',
    borderBottomWidth: 1.5,
  },
  androidPickerText: {
    color: 'black',
    fontSize: 16,
  },
});
