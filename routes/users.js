const express = require('express');
const User = require('../models/user');
const { requiredFields } = require('./utils');

const router = express.Router();

router.post('/', requiredFields(['email', 'password']), ({ body: { email, password } }, res) =>
  User.create({ email, password }).then(() => res.sendStatus(201)));

module.exports = router;
