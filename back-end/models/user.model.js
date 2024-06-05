const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isGoogleAuthorized: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    archive: {
      type: Boolean,
      private: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(AutoIncrement, { id: 'user_id' });
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('findOne', async function (next) {
  //For setting archive to false for filter
  this._conditions.archive = false;
  next();
});

userSchema.pre('find', async function (next) {
  //For setting archive to false for filter
  this._conditions.archive = false;
  next();
});
userSchema.pre('findById', async function (next) {
  //For setting archive to false for filter
  this._conditions.archive = false;

  next();
});

userSchema.pre('countDocuments', async function (next) {
  this._conditions.archive = false;
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
