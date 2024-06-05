const config = require("../config/config");
const jwt = require('jsonwebtoken');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const {User} = require("../models")
const setValidateTokenHeaders = async(req, res, next) => {

  try {
  const payload = jwt.verify(req.body.token, config.jwt.secret);
  const user = await User.findOne({archive:false, _id:payload.sub})

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found")
  }
  if (req.user._id != user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Access")
  }
  next();
  } catch {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));

  }
  
};

module.exports = { setValidateTokenHeaders };
