const express = require('express');

const { jwtAuth, requiredFields } = require('./utils');
const Pair = require('../models/pair');

const router = express.Router();

router.post(
  '/',
  requiredFields(['native', 'foreign']),
  jwtAuth,
  ({ user, body: { native, foreign } }, res) =>
    Pair.create({ native, foreign, user }).then(pair => res.status(201).send(pair)),
);

router.get('/', jwtAuth, ({ user }, res) => res.json(user));

module.exports = router;
