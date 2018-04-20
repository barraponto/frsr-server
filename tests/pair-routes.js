const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../app');
const mock = require('./mock');
const User = require('../models/user');

const { MONGODB_URL } = require('../config');

chai.should();
chai.use(chaiHttp);

describe('Test Login and Signup forms', () => {
  before('Connect mongoose', () => mongoose.connect(MONGODB_URL));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());
  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());

  ['native', 'foreign'].forEach((field) => {
    it(`should post /pairs and fail missing required field ${field}`, () => {
      const userData = mock.user();
      const pairData = mock.pair();
      return User.create(userData)
        .then(user =>
          chai
            .request(app)
            .post('/pairs')
            .set('Authorization', `Bearer ${user.createToken()}`)
            .send({ ...pairData, [field]: undefined }))
        .then((response) => {
          response.status.should.equal(400);
          response.body.error.should.contain(field);
        });
    });
  });

  it('should post /pairs and succeed', () => {
    const userData = mock.user();
    const pairData = mock.pair();
    return User.create(userData)
      .then(user =>
        chai
          .request(app)
          .post('/pairs')
          .set('Authorization', `Bearer ${user.createToken()}`)
          .send({ ...pairData }))
      .then((response) => {
        response.status.should.equal(201);
        response.body.should.have.keys(['native', 'foreign', 'id']);
        response.body.should.not.have.keys(['_id', '__v', 'user']);
        response.body.native.should.equal(pairData.native);
        response.body.foreign.should.equal(pairData.foreign);
      });
  });
});
