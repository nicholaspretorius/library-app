const express = require('express');
const chalk = require('chalk'); // sets colours on console messages
const morgan = require('morgan'); // logs the http verbs
const debug = require('debug')('app');
const path = require('path'); // builds up valid pathnames to avoid the __dirname concat issue
// const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3004;

// const config = {
//   user: '...',
//   password: '...',
//   server: 'pslibrary.database.windows.net', // or for local 'localhost' you can use 'localhost\\instance' to connect to a named instance
//   database: 'PSLibrary',
//   options: {
//     encrypt: true // use this if you are on Azure
//   }
// };
// sql.connect(config).catch(err => debug(err)); // will get an error connecting to azure so go to db Firewall Settings and click "+ Add Client IP" and Save

const nav = [
  { title: 'Books', link: '/books' }, 
  { title: 'Authors', link: '/authors' }
];

const bookRouter = require('./src/routes/bookRoutes.js')(nav);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/'))); // set the location for static files
app.set('views', path.join(__dirname, '/src/views/'));
app.set('view engine', 'ejs');

// app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

app.use('/books', bookRouter);

app.get('/', (req, res) => {
  // res.send("<h1>Hello world!</h1>");
  // res.json({ "hello": "world" });
  // res.sendFile(path.join(__dirname, '/views/index.html'));
  res.render('index', { 
    title: 'Library',
    nav
  });
});

app.listen(port, () => {
  debug(`Library application listening on: ${chalk.green(port)}`);
});
