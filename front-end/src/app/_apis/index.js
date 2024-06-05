const { REST_URLS } = require('../_utils/endpoints');
const { invokeApi, HTTP_METHODS } = require('../_utils/http-service');

export const getCalendarEvents = (startDate, endDate, setDataFunc) => {
  invokeApi(
    HTTP_METHODS.GET,
    `${REST_URLS.GET_CALENDAR_EVENTS}`,
    null,
    { startDate, endDate },
    localStorage
  ).then((res) => {
    if (Array.isArray(res)) {
      const convertedData = res.map((item) => {
        const {
          id,
          start,
          end,
          summary,
        } = item;
        return {
          id,
          start: new Date(start.dateTime).toISOString().replace(/T.*$/, '') ,
          end: new Date(end.dateTime).toISOString().replace(/T.*$/, '') ,
          startStr: new Date(start.dateTime).toISOString(),
          endStr: new Date(end.dateTime).toISOString(),
          title: summary || 'No title',
          extendedProps: item,
        };
      });
      setDataFunc(convertedData);
    }
  });
};
