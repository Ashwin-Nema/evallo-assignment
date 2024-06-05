import { trackPromise } from 'react-promise-tracker';
import {
  getOfflineData,
  setOfflineData,
  clearTokenDataAndRedirectToLogin,
} from './offline-services';
import { REST_URLS } from './endpoints';
import { toast } from 'react-toastify';

export const HTTP_METHODS = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const getRefreshToken = async (refreshToken, localStorage) => {
  try {
    const response = await trackPromise(
      fetch(`${REST_URLS.REFRESH_TOKEN}`, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
    const tokens = await response.json();
    if (tokens.code === 401 || tokens.code) {
      // toast.error('Token expired');
      localStorage.clear();
    } else {
      setOfflineData('tokens', tokens, localStorage);
    }
    return tokens.access.token || '';
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};

const getToken = async (localStorage) => {
  let tokens = getOfflineData('tokens', localStorage);
  if (tokens === '') {
    return;
  }
  let expiredAt =
    (tokens && tokens.access && new Date(tokens.access.expireAt)) ||
    new Date(1970);
  expiredAt.setMinutes(expiredAt.getMinutes() - 1);
  if (expiredAt > new Date()) {
    return (tokens && tokens.access && tokens.access.token) || '';
  } else {
    return await getRefreshToken(tokens.refresh.token, localStorage);
  }
};

export const invokeApi = async (method, url, data, params, localStorage) => {
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${await getToken(localStorage)}`,
  };

  if (params) {
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    url = url + '?' + query;
  }

  return trackPromise(
    fetch(url, {
      method: method,
      body: (data && JSON.stringify(data)) || undefined,
      headers: headers,
      params: params,
    })
      .then((response) => {
        if (response.status === 401) {
          toast.error('Token expired');
          clearTokenDataAndRedirectToLogin(null, localStorage);
        }

        if (response.status === 204) {
          return Promise.resolve('ok');
        }
        return response.json();
      })
      .catch((err) => {
        toast.error(err?.message);
      })
  );
};
