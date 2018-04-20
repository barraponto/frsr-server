const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../app');
const config = require('../config');
const mock = require('./mock');
const User = require('../models/user');

chai.should();
chai.use(chaiHttp);

describe('Test Login and Signup forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());
  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());

  it('should post /pairs and succeed', () => {
    const userData = mock.user();
    const pairData = mock.pair();
    return User.create(userData)
      .then(user =>
        chai
          .request(app)
          .post('/pairs')
          .set('Authorization', `Bearer ${user.createToken()}`)
          .send({ ...pairData, user }))
      .then((response) => {
        response.status.should.equal(201);
        response.body.native.should.equal(pairData.native);
        response.body.foreign.should.equal(pairData.foreign);
      });
  });
});
