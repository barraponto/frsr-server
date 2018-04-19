const express = require('express');
const logger = require('morgan');
const passport = require('./passport');
const { notFound, genericError } = require('./error');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use(notFound);
app.use(genericError);

module.exports = app;
