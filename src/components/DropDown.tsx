import React from 'react';
import {View, ViewStyle} from 'react-native';
import Dropdown from 'react-select';

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
  return (
    <View style={props.style}>
      <Dropdown
        menuPortalTarget={document.body}
        isSearchable={false}
        options={props.items}
        placeholder={props.placeholder}
      />
    </View>
  );
};

export default DropDown;
