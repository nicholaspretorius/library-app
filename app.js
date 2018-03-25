var express = require('express');
var chalk = require('chalk'); // sets colours on console messages
var morgan = require('morgan'); // logs the http verbs
var debug = require('debug')('app');
var path = require('path'); // builds up valid pathnames to avoid the __dirname concat issue

var app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/'))); // set the location for static files

// app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

app.get('/', function(req, res){
    //res.send("<h1>Hello world!</h1>");
    //res.json({ "hello": "world" });
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

var port = process.env.PORT || 3004;
app.listen(port, function(){
    debug(`Library application listening on: ${chalk.green(port)}`);
});