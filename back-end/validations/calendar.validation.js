const Joi = require('joi');

const attendeeSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

const dateTimeSchema = Joi.object()
  .keys({
    dateTime: Joi.date().required(),
  })
  .required();

const calendarEventSchema = Joi.object()
  .keys({
    summary: Joi.string().allow(''),
    attendees: Joi.array()
      .items(attendeeSchema)
      .unique((attendee1, attendee2) => attendee1.email === attendee2.email)
      .message('All emails must be unique'),
    start: dateTimeSchema,
    end: dateTimeSchema,
    description: Joi.string().allow(''),
    sessionNotes: Joi.string().allow(''),
  })
  .with('start', 'end')
  .custom((value) => {
    const startTime = new Date(value.start.dateTime).getTime();
    const endTime = new Date(value.end.dateTime).getTime();

    if (startTime > endTime) {
      throw new Joi.ValidationError('End date must be greater than start date');
    }

    return value;
  });

const createCalendarEvent = {
  body: calendarEventSchema,
};

const updateCalendarEvent = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: calendarEventSchema,
};

const queryCalendarEvents = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

const deleteCalendarEvent = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createCalendarEvent,
  queryCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
};
