const passport = require('../passport');

const requiredFields = fields => (req, res, next) => {
  const missing = fields.filter(field => !(field in req.body) || req.body[field] === '');
  if (missing.length) {
    const err = new Error(`Missing fields ${missing.join(', ')} in request body.`);
    err.status = 400;
    next(err);
  } else {
    next();
  }
};

const jwtAuth = passport.authenticate('jwt', { session: false });
const localAuth = passport.authenticate('local', { session: false });

module.exports = { jwtAuth, localAuth, requiredFields };
