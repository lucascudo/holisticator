const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');

const config = require('./config/app');
const pokemonRoutes = require('./modules/pokemon/pokemon_routes');
const userRoutes = require('./modules/user/user_routes');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUri, {useMongoClient: true});

app
.use(logger('dev'))
.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
.use(passport.initialize())
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))
.use(fileUpload())
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// view engine setup
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'jade')

.use('/api', userRoutes)
.use('/api/pokemon', pokemonRoutes)
.get('/', (req, res) => res.send('PokeStore is running!'))
// catch 404 and forward to error handler
.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
})
// error handler
.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
