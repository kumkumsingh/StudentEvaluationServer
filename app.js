require('dotenv').config();
const createError    = require('http-errors');
const express        = require('express');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const mongoose     = require('mongoose');
const session      = require('express-session');
const Mongostore   = require('connect-mongo')(session)
const cors           = require('cors')

mongoose
  .connect(process.env.MONGODB_URL, 
    {useNewUrlParser: true , 
     useUnifiedTopology: true,
     useFindAndModify: false,
     useCreateIndex: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new Mongostore({
    mongooseConnection: mongoose.connection,
    // ttl: 24 * 60 * 60 // 1 day
    ttl: 5 * 60
  })
}))

require('./passport')(app);

app.get('/', (req, res, next) =>  res.status(200).json({ message: 'Welkome to home page'}))

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const uploadRouter = require('./routes/upload');
app.use('/upload', uploadRouter);

const evaluationRouter = require('./routes/evaluation');
app.use('/evaluation', evaluationRouter);

const studentRouter = require('./routes/students');
app.use('/students', studentRouter);

const batchRouter = require('./routes/batch');
app.use('/batch', batchRouter);

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
