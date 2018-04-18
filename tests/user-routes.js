const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const config = require('../config');
const mock = require('./mock');

chai.should();
chai.use(chaiHttp);

describe('Test Login and Signup forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());
  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());

  it.only('should POST /users and fail required fields', () => {
    const { email } = mock.user();
    return chai
      .request(app)
      .post('/users')
      .send({ email })
      .then((response) => {
        response.status.should.equal(400);
      });
  });

  it.only('should POST /users and succeed', () => {
    const { email, password } = mock.user();
    return chai
      .request(app)
      .post('/users')
      .send({ email, password })
      .then((response) => {
        response.status.should.equal(201);
      });
  });
});
