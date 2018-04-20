const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { JWT_EXPIRY, JWT_SECRET, SALT_WORK_FACTOR } = require('../config');

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});

UserSchema.pre('save', function hashPassword(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then(salt => bcrypt.hash(user.password, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch(err => next(err));
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.createToken = function createToken() {
  return jwt.sign({ user: this.id }, JWT_SECRET, {
    subject: this.email,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

UserSchema.methods.toJSON = function serialize() {
  /* eslint-disable-next-line no-underscore-dangle */
  return { email: this.email, id: this._id };
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
