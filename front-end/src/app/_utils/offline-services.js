export const setOfflineData = (key, data, localStorage) => {
  if (data !== '' && data !== null && data !== undefined) {
    localStorage.setItem(`evallo:${key}`, JSON.stringify(data));
  }
};

export const getOfflineData = (key, localStorage) => {
  const data = localStorage.getItem(`evallo:${key}`);
  if (data !== '' && data !== null && data !== undefined) {
    return JSON.parse(data);
  } else {
    return '';
  }
};

export const clearOfflineData = (key, localStorage) => {
  localStorage.removeItem(`evallo:${key}`);
};

export const clearTokenDataAndRedirectToLogin = (router, localStorage) => {
  clearOfflineData('user', localStorage);
  clearOfflineData('tokens', localStorage);
  if (router) {
    router.push('/login');
    return;
  }
  window.location.href = "/login";
};
