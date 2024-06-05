const express = require('express');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const auth = require('../middlewares/auth');
const { authController } = require('../controllers');

const router = express.Router();

router.post(
  '/login',
  validate(authValidation.googleLogin),
  authController.googleLogin
);

router.post(
  '/refresh-tokens',
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  '/regenerate-google-token',
  validate(authValidation.googleLogin),
  auth(),
  authController.googleLogin
);

router.post('/logout', validate(authValidation.logout), authController.logout);

module.exports = router;
