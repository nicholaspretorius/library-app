const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getIndex(req, res) {
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
  }

  function getById(req, res) {
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

        book.details = await bookService.getBookById(book.bookId);
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
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  }

  // revealing module pattern
  return {
    getIndex, 
    getById,
    middleware
  };
}

module.exports = bookController;
