const passport = require('passport');

require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
  app.use(passport.initialize()); // create functions to use on the req, such as login
  app.use(passport.session());
  // stores user in the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // retrieve the user in the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
