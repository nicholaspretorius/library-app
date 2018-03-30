const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    // mongo
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDB to use local strategy');

        const db = client.db(dbName);

        // authenticate user
        const user = await db.collection('users').findOne({ username });
        debug(user);
        if (user && user.password !== password) {
          done(null, false);
        } else if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }));
};
