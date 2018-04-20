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

  it('should POST /login and fail due to missing password', () => {
    const { email } = mock.user();
    return chai
      .request(app)
      .post('/auth/login')
      .send({ email })
      .then((response) => {
        response.status.should.equal(400);
        response.body.error.should.contain('password');
      });
  });

  it('should POST /login and fail due to wrong password', () => {
    const { email, password } = mock.user();
    return User.create({ email, password })
      .then(() =>
        chai
          .request(app)
          .post('/auth/login')
          .send({ email, password: 'hakuna matata' }))
      .then((response) => {
        response.status.should.equal(401);
      });
  });

  it('should POST /login and fail due to unknown user', () => {
    const { email, password } = mock.user();
    return chai
      .request(app)
      .post('/auth/login')
      .send({ email, password })
      .then((response) => {
        response.status.should.equal(401);
      });
  });

  it('should POST /login and succeed', () => {
    const { email, password } = mock.user();
    return User.create({ email, password })
      .then(() =>
        chai
          .request(app)
          .post('/auth/login')
          .send({ email, password }))
      .then((response) => {
        response.status.should.equal(200);
      });
  });
});
