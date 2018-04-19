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

module.exports = { requiredFields };
