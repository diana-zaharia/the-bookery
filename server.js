var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var path = require('path');
global.appRoot = path.resolve(__dirname);
global.locals = {};
var config = require('./app/config'); // get our config file
var routes   = require('./app/routes/routes'); // get the routes

var app = express();
var port = 4000;

app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret:config.secret, resave: false, saveUninitialized:true }));

//set path for static files, css,vendors etc.
app.use('/public/styles', express.static(__dirname + '/public/styles'));
app.use('/public/vendors', express.static(__dirname + '/public/vendors'));
app.use('/public/assets', express.static(__dirname + '/public/assets'));
app.use('/public/js', express.static(__dirname + '/public/js'));

app.use('/', routes);
app.listen(port);
console.log('search for waldo at: http://localhost:' + port);
