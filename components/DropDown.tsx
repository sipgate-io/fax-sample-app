import React, {ReactElement, ReactText} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export interface DropDownItem {
  label: string;
  value: string;
}

interface Props {
  items: DropDownItem[];
  selected: DropDownItem | undefined;
  onChange: (item: DropDownItem) => void;
}

export const DropDown = (props: Props) => {
  return (
    <View>
      <DropDownPicker
        items={props.items}
        containerStyle={{height: 40}}
        showArrow={false}
        placeholder="Select your fax line"
        onChangeItem={(item: any) => {
          props.onChange(item as DropDownItem);
          console.log(item);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
