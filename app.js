var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var grant = require('grant').express()
var sessionParser = require('./lib/session');

var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionParser)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', function(req,res,next){
  if (req.session && req.session.user) {
    return express.static(path.join(__dirname, 'uploads'))(req,res,next);
  } else {
    res.render('login', {title: 'BigOof RailMap'});
  }
});


app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);

app.use(grant({
  "defaults": {
    "origin": process.env.ORIGIN,
    "transport": "session",
    "state": true
  },
  "discord": {
    "key": process.env.DISCORD_KEY,
    "secret": process.env.DISCORD_SECRET,
    "scope": ["guilds.members.read"],
    "callback": "/login",
  }
}))

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

module.exports = app;