const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  // sign up user
  authRouter.route('/signup')
    .get((req, res) => {
      res.send('Hello Auth');
    })
    .post((req, res) => {
      debug(req.body);
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB to add a user');

          const db = client.db(dbName);
          const user = { username, password };

          // create user
          const response = await db.collection('users').insertOne(user);
          debug(response);

          // log user in
          req.login(response.ops[0], () => {
            res.redirect('/auth/profile');
          });
          // res.json(req.body);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  // sign in user
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/auth/signin'
    }));
  
  // view user profile when signed in
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/signin');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;
