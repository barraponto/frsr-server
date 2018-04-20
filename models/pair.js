const mongoose = require('mongoose');

const PairSchema = mongoose.Schema({
  native: String,
  foreign: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Pair = mongoose.model('Pair', PairSchema);

module.exports = Pair;
