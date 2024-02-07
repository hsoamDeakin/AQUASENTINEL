#!/usr/bin/env node

/**
 * Module dependencies.
 */

var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts')
var path = require('path');
var cookieParser = require('cookie-parser');
const db = require('./db'); // Update the path accordingly
const session = require('express-session');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); 

const userController = require('./controllers/userController');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
db.connectDB();

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');
var streamingRouter = require('./routes/streaming');
var visulisationRouter = require('./routes/visulisation');
var apiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
// Set the default layout to use for all routes
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
// Middleware to initialize session
app.use(session({
  secret: 'key', // Change this to your actual secret key
  saveUninitialized: true,
  resave: true, 
  cookie:{
      // Session max age in milliseconds. (1 min)
      // Calculates the Expires Set-Cookie attribute
      maxAge:6000000
  } 
})); 
// Custom middleware to add user data to locals
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});



app.use('/', indexRouter);
app.use('/user', userRoutes); //Mount user routes
app.use('/streaming',userController.verifyUserSession, streamingRouter);
app.use('/visulisation', userController.verifyUserSession, visulisationRouter);
app.use('/api', apiRouter);

 const setSessionSecret = (req, res, next) => {
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  req.session.sessionSecret = sessionSecret;
  req.sessionOptions = req.sessionOptions || {};
  req.sessionOptions.secret = sessionSecret;
  next();
}; 

app.use(session({
  secret: '62254e08f1826f0a4fe93be2bb4f1ce7a4809c69bfa525bc74ea6e1294ecc96d',
  resave: true,
  saveUninitialized: true
}));

app.use(['/login', '/myprofile'], setSessionSecret);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 next(createError(404));
}); 

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); 

var debug = require('debug')('aquasentinel:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */


let server = require("http").createServer(app);
let io = require("socket.io")(server, { /* options */ });

// var server = http.createServer(app); 
// const io = require('socket.io')(server);   

// Handle socket connections
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 1000);

});
//app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));
// Initialize Socket.io 

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

