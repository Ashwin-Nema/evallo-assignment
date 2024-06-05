const express = require('express');
const validate = require('../middlewares/validate');
const { calendarValidation } = require('../validations');
const auth = require('../middlewares/auth');
const { calendarController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .get(
    validate(calendarValidation.queryCalendarEvents),
    auth(),
    calendarController.queryCalendarEvents
  )
  .post(
    validate(calendarValidation.createCalendarEvent),
    auth(),
    calendarController.createCalendarEvent
  );

router
  .route('/:id')
  .put(
    validate(calendarValidation.updateCalendarEvent),
    auth(),
    calendarController.updateCalendarEvent
  )
  .delete(
    validate(calendarValidation.deleteCalendarEvent),
    auth(),
    calendarController.deleteCalendarEvent
  );

module.exports = router;
