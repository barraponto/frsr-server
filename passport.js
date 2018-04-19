const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const User = require('./models/user');
const { JWT_SECRET } = require('./config');

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  (email, password, done) =>
    User.findOne({ email })
      .then(user => Promise.all([user, user ? user.checkPassword(password) : false]))
      .then(([user, validated]) => (user && validated ? done(null, user) : done(null, false)))
      .catch(err => done(err, false)),
));

passport.use(new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256'],
  },
  (payload, done) => User.findById(payload.user).then(user => done(null, user)),
));

module.exports = passport;
