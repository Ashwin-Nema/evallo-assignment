export const timeFormats = [
  {
    label: '12 hour',
    value: 'h:mm aa',
  },
  { label: '24 Hour', value: 'HH:mm' },
];

export const dateFormats = [
  {
    label: 'DD-MM-YYYY',
    value: 'dd-MM-yyyy',
  },
  {
    label: 'MM-DD-YYYY',
    value: 'MM-dd-yyyy',
  },
  {
    label: 'YYYY-MM-DD',
    value: 'yyyy-MM-dd',
  },
];

export const defaultCalendarModalDetails = {
  email: '',
  attendees: [],
  startDate: new Date(),
  endDate: new Date(),
  summary: '',
  description: '',
  sessionNotes: '',
};
