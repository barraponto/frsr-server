const mongoose = require('mongoose');

const PairSchema = mongoose.Schema({
  native: String,
  foreign: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

PairSchema.methods.toJSON = function serialize() {
  /* don't send user info -- authorized users can only access their own pairs */
  /* eslint-disable-next-line no-underscore-dangle */
  return { native: this.native, foreign: this.foreign, id: this._id };
};

const Pair = mongoose.model('Pair', PairSchema);

module.exports = Pair;
