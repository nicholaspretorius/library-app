const express = require('express');
// const mongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb'); // same as above line
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

const books = [
  { title: 'The Dark Tower', author: 'Stephen King', genre: 'Horror' },
  { title: 'The Stand', author: 'Stephen King', genre: 'Horror' },
  { title: 'The Lord of the Rings', author: 'JRR Tolkien', genre: 'Fantasy' },
  { title: 'Jurassic Park', author: 'Michael Crichton', genre: 'Sci-Fi' }
];

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017'; // standard mongodb location
      const dbName = 'libraryApp';
      
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the Mongo Server');

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        } 
        client.close();
      }());
      // res.send('Going to inset books here');
    });
  return adminRouter;
}

module.exports = router;
