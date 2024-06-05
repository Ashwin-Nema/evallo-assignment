const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { Token } = require('../models');
const { tokenTypes } = require('../config/tokens');

const generateToken = (userId, expireAt, type, secret = config.jwt.secret) => {
  let tokenSecret = secret ? secret : config.jwt.secret;
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expireAt.unix(),
    type,
  };
  return jwt.sign(payload, tokenSecret);
};

const saveToken = async (
  token,
  userId,
  expireAt,
  type,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expireAt: expireAt?.toDate?.(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const generateGoogleToken = async (googleToken, user) => {
  await saveToken(googleToken, user.id, null, tokenTypes.GOOGLE_REFRESH_TOKEN);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );

  let accesstokenParamters = [user.id, accessTokenExpires, tokenTypes.ACCESS];
  let refreshTokenParamters = [
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
  ];

  const accessToken = generateToken(...accesstokenParamters);
  const refreshToken = generateToken(...refreshTokenParamters);
  await saveToken(accessToken, user.id, accessTokenExpires, tokenTypes.ACCESS);
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expireAt: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expireAt: refreshTokenExpires.toDate(),
    },
  };
};

const verifyToken = async (token, type) => {
  const tokenVerifyingParameters = [token, config.jwt.secret];

  const payload = jwt.verify(...tokenVerifyingParameters);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

module.exports = {
  generateToken,
  saveToken,
  generateAuthTokens,
  verifyToken,
  generateGoogleToken,
};
