const testing = process.env.NODE_ENV === 'testing';

module.exports = {
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1w',
  JWT_SECRET: process.env.JWT_SECRET || '4', // dice roll, guaranteed random
  MONGODB_URL:
    process.env.MONGODB_URL ||
    (testing ? 'mongodb://localhost/frsr-test' : 'mongodb://localhost/frsr'),
  SALT_WORK_FACTOR: process.env.SALT_WORK_FACTOR || 1, // good enough for dev
};
