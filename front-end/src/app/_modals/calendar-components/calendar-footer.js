import { deleteObjProperties } from '@/app/_utils';
import { REST_URLS } from '@/app/_utils/endpoints';
import { HTTP_METHODS, invokeApi } from '@/app/_utils/http-service';
import { getOfflineData, setOfflineData } from '@/app/_utils/offline-services';
import { ModalFooter, Button } from '@nextui-org/react';
import { toast } from 'react-toastify';

const CalendarFooter = ({ onClose, formDetails, refreshGetUser }) => {
  const createUpdateEvent = () => {
    const calendarId = formDetails.id;
    const allDetails = { ...formDetails };
    allDetails.attendees = allDetails.attendees.map((email) => ({
      email: email.key,
    }));

    allDetails.start = {
      dateTime: allDetails.startDate,
    };
    allDetails.end = {
      dateTime: allDetails.endDate,
    };

    deleteObjProperties(allDetails, ['startDate', 'endDate', 'email', 'id']);

    invokeApi(
      calendarId ? HTTP_METHODS.PUT : HTTP_METHODS.POST,
      calendarId
        ? `${REST_URLS.UPDATE_CALENDAR_EVENT}${calendarId}`
        : REST_URLS.CREATE_CALENDAR_EVENT,
      allDetails,
      null,
      window.localStorage
    ).then((res) => {
      if (res?.code >= 400) {
        toast.error(res?.message);
        if (res?.code === 403) {
          const user = getOfflineData('user', window.localStorage);
          user.isGoogleAuthorized = false;
          setOfflineData('user', user, window.localStorage);
          refreshGetUser((prevState) => !prevState);
        }
        return;
      }
      toast.success(
        `Event ${formDetails.id ? 'created' : 'updated'} successfully`
      );
      onClose(!!calendarId);
    });
  };

  const deleteCalendarEvent = () => {
    const calendarId = formDetails.id;
    invokeApi(
      HTTP_METHODS.DELETE,
      `${REST_URLS.DELETE_CALENDAR_EVENT}${calendarId}`,
      null,
      null,
      window.localStorage
    ).then((res) => {
      if (res?.code >= 400) {
        toast.error(res?.message);
        if (res?.code === 403) {
          const user = getOfflineData('user', window.localStorage);
          user.isGoogleAuthorized = false;
          setOfflineData('user', user, window.localStorage);
          refreshGetUser((prevState) => !prevState);
        }
        return;
      }
      toast.success(`Event deleted successfully`);
      onClose(!!calendarId);
    });
  };

  return (
    <ModalFooter>
      <Button color="danger" variant="light" onPress={onClose}>
        Cancel
      </Button>
      {formDetails?.id ? (
        <Button onClick={deleteCalendarEvent} color="danger">
          Delete
        </Button>
      ) : null}
      <Button onPress={createUpdateEvent} color="primary">
        {formDetails?.id ? 'Update' : 'Create'}
      </Button>
    </ModalFooter>
  );
};

export default CalendarFooter;
