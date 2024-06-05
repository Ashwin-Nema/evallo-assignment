export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const deleteObjProperties = (obj, properties) => {
  properties?.forEach((key) => {
    delete obj?.[key];
  });
};

// multipleValues - In case of multipleValues key is not necessary as it sets multple values at once
export const setFormConfig =
  (configSetter) => (key) => (value, multipleValues) => {
    if (multipleValues) {
   
      configSetter((prevVal) => ({ ...prevVal, ...value }));
      return;
    }
    configSetter((prevVal) => ({ ...prevVal, [key]: value }));
  };

export const formatDataForModal = (data) => {
  const { attendees, start, end, id, summary, description, sessionNotes } =
    data;

  return {
    id,
    summary: summary || '',
    attendees:
      attendees?.map?.(({ email }) => ({ label: email, key: email })) || [],
    startDate: start.dateTime,
    endDate: end.dateTime,
    description: description || '',
    sessionNotes: sessionNotes || '',
  };
};
