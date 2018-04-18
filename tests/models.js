const chai = require('chai');
const mongoose = require('mongoose');
const config = require('../config');
const mock = require('./mock');
const User = require('../models/user');

chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());
  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());

  it('should save User', () => {
    const userData = mock.user();
    return User.create(userData).then((user) => {
      user.email.should.be.a('string');
      user.email.should.equal(userData.email);
    });
  });

  it('should check User pasword', () => {
    const userData = mock.user();
    return User.create(userData)
      .then(user => User.findById(user.id))
      .then(user => user.checkPassword(userData.password))
      .then(result => result.should.be.ok);
  });
});
