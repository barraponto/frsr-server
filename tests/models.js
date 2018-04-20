const chai = require('chai');
const mongoose = require('mongoose');

const mock = require('./mock');
const Pair = require('../models/pair');
const User = require('../models/user');

const { MONGODB_URL } = require('../config');

chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(MONGODB_URL));
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

  it('should save Pair', () => {
    const userData = mock.user();
    const pairData = mock.pair();
    return User.create(userData)
      .then(user => Promise.all([user, Pair.create({ ...pairData, user })]))
      .then(([user, pair]) => {
        pair.native.should.equal(pairData.native);
        pair.foreign.should.equal(pairData.foreign);
        pair.user.email.should.equal(userData.email);
        pair.user.id.should.equal(user.id);
      });
  });
});
