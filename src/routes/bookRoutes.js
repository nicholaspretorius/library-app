const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodReadsService');

const bookRouter = express.Router();

// const sql = require('mssql'); // not yet npm installed
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const { getIndex, getById, middleware } = bookController(bookService, nav);
  bookRouter.use(middleware);

  bookRouter.route('/')
    .get(getIndex);
  
  bookRouter.route('/:bid')
    /* middleware to catch all ids
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
    }) */
    .get(getById);

  return bookRouter;
}

module.exports = router;
