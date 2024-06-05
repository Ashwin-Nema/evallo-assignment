import { toast } from 'react-toastify';
const { validateEmail } = require('../_utils');

export const addEmail = (config, setConfig, userEmail) => {
  const email = config?.email?.trim?.();
  if (userEmail === email) {
    toast.error('User cannot add himself as Participant');
    return;
  }
  const curEmailList = [...config.attendees];
  const attendees = config.attendees.map((item) => item.key);
  if (!validateEmail(email)) {
    toast.error('Email is not valid');
    return;
  }

  if (attendees?.includes?.(email)) {
    toast.error('Duplicate emails are not allowed');
    return;
  }
  curEmailList.push({
    label: email,
    key: email,
  });
  setConfig((prevConfig) => {
    return {
      ...prevConfig,
      email: '',
      attendees: curEmailList,
    };
  });
};

export const deleteEmail = (config, setConfig, emailToDelete) => {
  const attendees = config.attendees.filter((email) => email === emailToDelete);
  setConfig((prevConfig) => {
    return {
      ...prevConfig,
      attendees,
    };
  });
};

export const setCalendarValues =
  (formDetails, setFormDetails) => (key) => (value) => {
    switch (key) {
      case 'startDate':
        if (new Date(formDetails.endDate) < new Date(value)) {
          toast.error('Start date cannot be greater than end date');
          return;
        }
        break;
      case 'endDate':
        if (new Date(formDetails.startDate) > new Date(value)) {
          toast.error('Start date cannot be greater than end date');
          return;
        }
        break;

      default:
        break;
    }
    setFormDetails((prevDetails) => {
      return {
        ...prevDetails,
        [key]: value,
      };
    });
  };
