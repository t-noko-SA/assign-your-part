const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const router = require('./routes/router');

const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://code.jquery.com/jquery-3.5.1.slim.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js'],
      connectSrc: ["'self'"],
      styleSrc: ["'self'", 'fonts.googleapis.com', "'unsafe-inline'", 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
