const { google } = require('googleapis');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../config/config');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');

// authenticating google login and getting user credentials
const getGoogleDetails = async (req, reAuthorize) => {
  const oAuth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUrl
  );
  const { code } = req.body;

  const response = await oAuth2Client.getToken(code);
  const tokens = response.tokens;
  const requiredScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
  ];
  const allScopesPresent = requiredScopes.every((scope) =>
    tokens?.scope?.includes?.(scope)
  );

  if (!allScopesPresent) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please grant us sufficient permissions. We need calendar and other permissions'
    );
  }

  oAuth2Client.setCredentials({ access_token: tokens.access_token });
  const people = google.people({ version: 'v1', auth: oAuth2Client });

  const result = await people.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses',
  });

  const profile = result.data;
  if (reAuthorize && req.user.email !== profile.emailAddresses[0].value) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User can only authorize its calender and not other calendars'
    );
  }
  return {
    name: profile.names[0].displayName,
    email: profile.emailAddresses[0].value,
    google_token: tokens.refresh_token,
  };
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const logout = async (refreshToken, accessToken) => {
  const accessTokenDoc = await Token.findOne({
    token: accessToken,
    type: tokenTypes.ACCESS,
    blacklisted: false,
  });
  if (accessTokenDoc) {
    await Token.findOneAndDelete({ _id: accessTokenDoc.id });
  }

  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  if (refreshTokenDoc) {
    await Token.findOneAndDelete({ _id: refreshTokenDoc.id });
  }
};

module.exports = { getGoogleDetails, refreshAuth, logout };
