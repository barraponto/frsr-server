const express = require('express');
const { localAuth, requiredFields } = require('./utils');

const router = express.Router();

router.post('/login', requiredFields(['email', 'password']), localAuth, (req, res) =>
  res.json({ authToken: req.user.createToken() }));

module.exports = router;
