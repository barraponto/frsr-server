const express = require('express');
const User = require('../models/user');
const { jwtAuth, requiredFields } = require('./utils');

const router = express.Router();

router.post('/', requiredFields(['email', 'password']), ({ body: { email, password } }, res) =>
  User.create({ email, password }).then(user => res.status(201).send(user)));

router.get('/', jwtAuth, ({ user }, res) => res.json(user));

module.exports = router;
