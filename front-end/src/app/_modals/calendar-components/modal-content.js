import {
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Textarea,
} from '@nextui-org/react';

import CalendarAttendees from './calendar-attendees';
import CalendarTimePicker from './calender-time-picker';
import CalendarFooter from './calendar-footer';

const CalendarModalContent = ({
  formDetails,
  setProperty,
  refreshGetUser,
  setFormDetails,
  user,
  onClose,
}) => {
  return (
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1">
        {formDetails?.id
          ? 'Update Calendar Event'
          : 'Create Calendar Event'}
      </ModalHeader>
      <ModalBody>
        <Input
          value={formDetails.summary}
          onValueChange={setProperty('summary')}
          color="primary"
          label="Event title"
        />
        <Textarea
          value={formDetails.description}
          onValueChange={setProperty('description')}
          color="primary"
          label="Description"
        />
        <CalendarAttendees
          formDetails={formDetails}
          setFormDetails={setFormDetails}
          user={user}
          setProperty={setProperty}
        />
        <CalendarTimePicker
          formDetails={formDetails}
          setProperty={setProperty}
        />

        <Textarea
          value={formDetails.sessionNotes}
          onValueChange={setProperty('sessionNotes')}
          color="primary"
          label="Session notes"
        />
      </ModalBody>
      <CalendarFooter
        onClose={onClose}
        formDetails={formDetails}
        refreshGetUser={refreshGetUser}
      />
    </ModalContent>
  );
};

export default CalendarModalContent;
