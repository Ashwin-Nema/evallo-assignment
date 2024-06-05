const catchAsync = require('../utils/catchAsync');
const { calendarService } = require('../services');
const httpStatus = require('http-status');

const createCalendarEvent = catchAsync(async (req, res) => {
  await calendarService.createCalendarEvent(req);
  res
    .status(httpStatus.CREATED)
    .json({ message: 'Calendar event created successfully' });
});

const queryCalendarEvents = catchAsync(async (req, res) => {
  const data = await calendarService.queryCalendarEvents(req);
  res.send(data);
});

const updateCalendarEvent = catchAsync(async (req, res) => {
  await calendarService.updateCalendarById(req);
  res
    .status(httpStatus.OK)
    .json({ message: 'Calendar even updated successfully' });
});

const deleteCalendarEvent = catchAsync(async (req, res) => {
  await calendarService.deleteCalendarEvent(req);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCalendarEvent,
  queryCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
};
