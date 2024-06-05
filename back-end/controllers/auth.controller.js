const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const httpStatus = require('http-status');

const googleLogin = catchAsync(async (req, res) => {
  const { name, email, google_token } = await authService.getGoogleDetails(req);

  const user = await userService.getLoginUser({
    isGoogleAuthorized: true,
    name,
    email,
  });

  await tokenService.generateGoogleToken(google_token, user);

  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

const regenerateGoogleToken = catchAsync(async (req, res) => {
  const { google_token } = await authService.getGoogleDetails(req, true);
  await tokenService.generateGoogleToken(google_token, req.user);
  res.status(httpStatus.OK, 'Token updated successfully');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken, req.body.accessToken);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { googleLogin, refreshTokens, regenerateGoogleToken, logout };
