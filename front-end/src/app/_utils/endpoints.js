export const backendService = `${process.env.NEXT_PUBLIC_BACKEND_URL}v1/`;

export const REST_URLS = {
  REFRESH_TOKEN: `${backendService}auth/refresh-tokens`,
  GOOGLE_LOGIN: `${backendService}auth/login`,
  CREATE_CALENDAR_EVENT: `${backendService}calendar`,
  GOOGLE_REAUTHORIZE: `${backendService}auth/regenerate-google-token`,
  LOGOUT: `${backendService}auth/logout`,
  GET_CALENDAR_EVENTS: `${backendService}calendar`,
  UPDATE_CALENDAR_EVENT: `${backendService}calendar/`,
  DELETE_CALENDAR_EVENT: `${backendService}calendar/`,
};
