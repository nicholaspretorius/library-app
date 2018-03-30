const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

const bookRouter = express.Router();

// const sql = require('mssql'); // not yet npm installed
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  // const books = [
  //   { title: 'The Dark Tower', author: 'Stephen King', genre: 'Horror' },
  //   { title: 'The Stand', author: 'Stephen King', genre: 'Horror' },
  //   { title: 'The Lord of the Rings', author: 'JRR Tolkien', genre: 'Fantasy' },
  //   { title: 'Jurassic Park', author: 'Michael Crichton', genre: 'Sci-Fi' }
  // ];
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  });

  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB');

          const db = client.db(dbName);
          const books = await db.collection('books').find().toArray();
          // res.json(response);
          res.render('books', {
            title: 'Books',
            nav,
            books
            // books: recordset // see recordset in debug messages in console 
          });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
      // (async function query() {
      //   const request = new sql.Request();
        
      //   const { recordset } = await request.query('select * from books');
      //   debug(recordset);
    });
  // }());
  
  
  bookRouter.route('/:bid')
    // middleware to catch all ids
    // .all((req, res, next) => {
    //   (async function query() {
    //     const { bid } = req.params; // object destructuring - same as const bid = req.params.bid
    //     const request = new sql.Request();
    //     const { recordset } = await request.input('id', sql.Int, bid) // destructuring i.e. const result = request.recordset
    //       .query('select * from books where id = @id');
    //     debug(recordset);
    //     [req.book] = recordset; // array destructuring - same as req.book = recordset[0];
    //     next(); // req.book now added to the req and passed through next();
    //   }());
    // })
    .get((req, res) => {
      const { bid } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB');

          const db = client.db(dbName);
          const book = await db.collection('books').findOne({ _id: new ObjectID(bid) });
          debug(book);
          res.render('book', {
            nav,
            book
            // book: req.book
          });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return bookRouter;
}

module.exports = router;
