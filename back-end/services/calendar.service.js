const { google } = require('googleapis');
const config = require('../config/config');
const { Token, CalendarEvent } = require('../models');
const userService = require('./user.service');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const pick = require('../utils/pick');

const getGoogleOauthClient = async (userId) => {
  const token = (
    await Token.find({ type: tokenTypes.GOOGLE_REFRESH_TOKEN, user: userId })
      .sort({ createdAt: -1 })
      .limit(1)
  )[0];

  if (!token) {
    userService.updateUserById(userId, { isGoogleAuthorized: false });
    throw new ApiError(httpStatus.FORBIDDEN, 'Google needs to be reauthorized');
  }

  const googleToken = token.token;
  const oAuth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUrl
  );

  oAuth2Client.setCredentials({ refresh_token: googleToken });
  return oAuth2Client;
};

const createCalendarEvent = async (req) => {
  const userId = req.user.id;
  const oAuth2Client = await getGoogleOauthClient(userId);
  const calendar = google.calendar('v3');
  try {
    const createdEvent = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: 'primary',

      requestBody: {
        ...req.body,
        extendedProperties: {
          private: {
            sessionNotes: req.body.sessionNotes || '',
          },
        },
      },
    });

    await CalendarEvent.create({
      ...req.body,
      userId,
      googleEventId: createdEvent.data.id,
    });
  } catch (err) {
    if (err?.message === 'invalid_grant') {
      userService.updateUserById(userId, { isGoogleAuthorized: false });
      await Token.deleteMany({
        type: tokenTypes.GOOGLE_REFRESH_TOKEN,
        user: userId,
      });
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Google needs to be reauthorized'
      );
    }

    throw new ApiError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const queryCalendarEvents = async (req) => {
  const userId = req.user.id;
  const filter = pick(req.query, ['startDate', 'endDate']);
  if (filter.startDate || filter.endDate) {
    filter['$or'] = [];
  }
  if (filter.startDate) {
    filter['$or'].push({
      'start.dateTime': { $gte: new Date(filter.startDate) },
    });
  }

  if (filter.endDate) {
    filter['$or'].push({ 'end.dateTime': { $lte: new Date(filter.endDate) } });
  }

  delete filter.startDate;
  delete filter.endDate;
  filter.userId = userId;
  return CalendarEvent.find(filter);
};

const updateCalendarById = async (req) => {
  const userId = req.user.id;
  const eventId = req.params.id;
  const calendarEvent = await CalendarEvent.findOne({ _id: eventId, userId });
  if (!calendarEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Calendar event not found');
  }
  try {
    const oAuth2Client = await getGoogleOauthClient(userId);
    const calendar = google.calendar('v3');
    await calendar.events.update({
      calendarId: 'primary',
      auth: oAuth2Client,
      eventId: calendarEvent.googleEventId,
      requestBody: {
        ...req.body,
        extendedProperties: {
          private: {
            sessionNotes: req.body.sessionNotes || '',
          },
        },
      },
    });
    await CalendarEvent.findByIdAndUpdate(eventId, req.body);
  } catch (err) {
    if (err?.message === 'invalid_grant') {
      userService.updateUserById(userId, { isGoogleAuthorized: false });
      await Token.deleteMany({
        type: tokenTypes.GOOGLE_REFRESH_TOKEN,
        user: userId,
      });
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Google needs to be reauthorized'
      );
    }
    throw new ApiError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const deleteCalendarEvent = async (req) => {
  const userId = req.user.id;
  const eventId = req.params.id;
  const calendarEvent = await CalendarEvent.findOne({ _id: eventId, userId });
  if (!calendarEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Calendar event not found');
  }
  try {
    const oAuth2Client = await getGoogleOauthClient(userId);
    const calendar = google.calendar('v3');
    await calendar.events.delete({
      calendarId: 'primary',
      auth: oAuth2Client,
      eventId: calendarEvent.googleEventId,
    });
    await CalendarEvent.findByIdAndUpdate(eventId, { archive: true });
  } catch (err) {
    if (err?.message === 'invalid_grant') {
      userService.updateUserById(userId, { isGoogleAuthorized: false });
      await Token.deleteMany({
        type: tokenTypes.GOOGLE_REFRESH_TOKEN,
        user: userId,
      });
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Google needs to be reauthorized'
      );
    }
    throw new ApiError(httpStatus.BAD_REQUEST, err?.message);
  }
};

module.exports = {
  createCalendarEvent,
  queryCalendarEvents,
  updateCalendarById,
  deleteCalendarEvent,
};
