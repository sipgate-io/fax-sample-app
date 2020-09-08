import React, {ReactElement, ReactText} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-community/picker';

interface DropDownItem {
  label: string;
  value: string;
}

interface Props {
  items: DropDownItem[];
  selected: string | undefined;
  onChange: (item: string) => void;
}

const DropDown = (props: Props) => {
  return (
    <View>
      <Picker
        selectedValue={props.selected}
        onValueChange={(value: ReactText) => props.onChange(value + '')}>
        {props.items.map((item: DropDownItem) => (
          <Picker.Item label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({});
