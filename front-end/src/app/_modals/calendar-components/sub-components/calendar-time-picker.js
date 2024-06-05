import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Chip,
} from '@nextui-org/react';

export const CustomTimeDropDown = ({ label, list, setMainFunc }) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set([list[0]]));
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={label}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        items={list}
        onSelectionChange={(newVal) => {
          const selectionList = [...newVal];
          const newValue = list.filter(
            (item) => selectionList[0] === item.value
          )[0];
          setMainFunc(newValue);
          setSelectedKeys(newVal);
        }}
      >
        {(item) => (
          <DropdownItem key={item.value} aria-label="List">
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export const CustomTimePicker = ({
  label,
  selected,
  timeFormat,
  dateFormat,
  setProperty,
}) => {
  return (
    <div>
      <div>
        <Chip className="time-dropdown-btn" color="primary" variant="faded">
          {label}
        </Chip>
      </div>

      <DatePicker
        showIcon
        showTimeSelect
        selected={selected}
        timeFormat={timeFormat.value}
        timeIntervals={15}
        dateFormat={`${dateFormat.value} ${timeFormat.value}`}
        onChange={setProperty}
      />
    </div>
  );
};
