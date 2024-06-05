const Joi = require('joi');

const googleLogin = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
    accessToken: Joi.string().required(),
  }),
};

module.exports = { googleLogin, refreshTokens, logout };
