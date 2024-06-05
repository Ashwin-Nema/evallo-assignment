import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './calendar-main-styles.css';
import { timeFormats, dateFormats } from '@/app/_utils/constants';
import { CustomTimeDropDown, CustomTimePicker } from './sub-components';
import { Chip } from '@nextui-org/react';

const CalendarTimePicker = ({ formDetails, setProperty }) => {
  const [timeFormat, setTimeFormat] = useState(timeFormats[0]);
  const [dateFormat, setDateFormat] = useState(dateFormats[0]);
  const timeDiff = formDetails.endDate - formDetails.startDate;

  // Convert the time difference from milliseconds to hours
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  return (
    <div className="flex flex-col calendar-modal-timpepicker">
      <div className="flex gap-4 mt-1">
        <CustomTimeDropDown
          label={`Time Format - ${timeFormat.label}`}
          list={timeFormats}
          setMainFunc={setTimeFormat}
        />
        <CustomTimeDropDown
          label={`Date Format - ${dateFormat.label}`}
          list={dateFormats}
          setMainFunc={setDateFormat}
        />
      </div>

      <div className="flex gap-4 mt-2">
        <CustomTimePicker
          label="Start Time"
          selected={formDetails.startDate}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          setProperty={setProperty('startDate')}
          property="startDate"
        />
        <CustomTimePicker
          label="End Time"
          selected={formDetails.endDate}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          setProperty={setProperty('endDate')}
        />
      </div>

      <Chip className="time-dropdown-btn mt-5" color="primary" variant="faded">
        Duration of event (in hours) - {hoursDiff}
      </Chip>
    </div>
  );
};

export default CalendarTimePicker;
