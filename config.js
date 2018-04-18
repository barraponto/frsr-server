const testing = process.env.NODE_ENV === 'testing';

module.exports = {
  MONGODB_URL:
    process.env.MONGODB_URL ||
    (testing ? 'mongodb://localhost/frsr-test' : 'mongodb://localhost/frsr'),
};
