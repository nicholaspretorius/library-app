const express = require('express');

const bookRouter = express.Router();

const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const books = [
    { title: 'The Dark Tower', author: 'Stephen King', genre: 'Horror' },
    { title: 'The Stand', author: 'Stephen King', genre: 'Horror' },
    { title: 'The Lord of the Rings', author: 'JRR Tolkien', genre: 'Fantasy' },
    { title: 'Jurassic Park', author: 'Michael Crichton', genre: 'Sci-Fi' }
  ];
  
  bookRouter.route('/')
    .get((req, res) => {
      const request = new sql.Request();
      request.query('select * from books')
        .then((result) => {
          res.render('books', {
            title: 'Books',
            nav,
            // books,
            books: result.recordset // see recordset in debug messages in console 
          });
        });
      res.render('books', {
        title: 'Books',
        nav,
        books
      });
    });
  
  bookRouter.route('/:bid')
    .get((req, res) => {
      const { bid } = req.params;
      res.render('book', {
        nav,
        book: books[bid]
      });
    });

  return bookRouter;
}

module.exports = router;
