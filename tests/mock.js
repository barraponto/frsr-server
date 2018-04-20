const faker = require('faker');

const user = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const pair = () => ({
  native: faker.random.word(),
  foreign: faker.lorem.word(),
});

module.exports = { pair, user };
