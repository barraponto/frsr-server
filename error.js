const notFound = (req, res, next) => {
  const err = new Error(`Path ${req.path} not found or does not respond to ${req.method} method.`);
  err.status = 404;
  next(err);
};

/* eslint-disable-next-line no-unused-vars */
const genericError = (err, req, res, next) => {
  const development = req.app.get('env') === 'development';
  const message = development ? { error: err.message } : null;
  res.status(err.status || 500).send(message);
};

module.exports = { notFound, genericError };
