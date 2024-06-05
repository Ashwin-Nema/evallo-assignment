const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { google } = require('../config/config');

const AutoIncrement = require('mongoose-sequence')(mongoose);

const attendeeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const dateSchema = mongoose.Schema(
  {
    dateTime: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const calendarEventSchema = mongoose.Schema(
  {
    _id: Number,
    summary: {
      type: String,
    },
    attendees: {
      type: [attendeeSchema],
    },
    start: dateSchema,
    end: dateSchema,
    description: {
      type: String,
    },
    googleEventId: {
      type: String,
      required: true,
    },
    sessionNotes: {
      type: String,
    },
    userId: {
      type: Number,
      ref: 'User',
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

calendarEventSchema.pre('findOne', async function (next) {
  this._conditions.archive = false;
  next();
});

calendarEventSchema.pre('find', async function (next) {
  this._conditions.archive = false;
  next();
});

calendarEventSchema.pre('findById', async function (next) {
  this._conditions.archive = false;
  next();
});

calendarEventSchema.pre('countDocuments', async function (next) {
  this._conditions.archive = false;
  next();
});

calendarEventSchema.plugin(toJSON);
calendarEventSchema.plugin(paginate);
calendarEventSchema.plugin(AutoIncrement, { id: 'calender_event_id' });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;
