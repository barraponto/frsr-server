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

  it('should POST /users and fail due to missing password', () => {
    const { email } = mock.user();
    return chai
      .request(app)
      .post('/users')
      .send({ email })
      .then((response) => {
        response.status.should.equal(400);
        response.body.error.should.contain('password');
      });
  });

  it('should POST /users and fail due to empty email', () => {
    const { password } = mock.user();
    return chai
      .request(app)
      .post('/users')
      .send({ email: '', password })
      .then((response) => {
        response.status.should.equal(400);
        response.body.error.should.contain('email');
      });
  });

  it('should POST /users and succeed', () => {
    const { email, password } = mock.user();
    return chai
      .request(app)
      .post('/users')
      .send({ email, password })
      .then((response) => {
        response.status.should.equal(201);
        response.body.should.have.keys(['id', 'email']);
        response.body.should.not.have.keys(['_id', '__v', 'password']);
        response.body.email.should.equal(email);
      });
  });

  it('should GET /users and fail due to wrong token', () => {
    const userData = mock.user();
    return User.create(userData)
      .then((user) => {
        const token = user.createToken().replace(/.{20}$/, 'iThinkThisIsUnlikely');
        return chai
          .request(app)
          .get('/users')
          .set('Authorization', `Bearer ${token}`);
      })
      .then((response) => {
        response.status.should.equal(401);
      });
  });

  it('should GET /users and fail due to missing user', () => {
    const userData = mock.user();
    return User.create(userData)
      .then((user) => {
        const token = user.createToken().replace(/.{20}$/, 'iThinkThisIsUnlikely');
        return Promise.all([token, User.findByIdAndRemove(user.id)]);
      })
      .then(([token]) =>
        chai
          .request(app)
          .get('/users')
          .set('Authorization', `Bearer ${token}`))
      .then((response) => {
        response.status.should.equal(401);
      });
  });

  it('should GET /users and succeed', () => {
    const userData = mock.user();
    return User.create(userData)
      .then(user =>
        Promise.all([
          user,
          chai
            .request(app)
            .get('/users')
            .set('Authorization', `Bearer ${user.createToken()}`),
        ]))
      .then(([user, response]) => {
        response.status.should.equal(200);
        response.body.should.have.keys(['id', 'email']);
        response.body.should.not.have.keys(['_id', '__v', 'password']);
        response.body.id.should.equal(user.id);
        response.body.email.should.equal(user.email);
      });
  });
});
