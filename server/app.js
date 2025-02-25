var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var partnerRouter = require('./routes/partner');
var currencyRouter = require('./routes/currency');
var locationRouter = require('./routes/location');
var rateRouter = require('./routes/rate');
var transactionRouter = require('./routes/transaction');

var app = express();

// cors setup
app.use(cors({
  exposedHeaders: ['Authorization']
}));

// swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Exchange API',
      version: '0.1.0',
    },
  },
  apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// mysql setup
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  else {
    // Create database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS exchange', (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Database created or already exists.');

      // Connect to the newly created or existing database
      db.changeUser({ database: 'exchange' }, (err) => {
        if (err) {
          throw err;
        }
        console.log('Connected to database.');
        var createPartnerTable = `CREATE TABLE IF NOT EXISTS partner (
                                idPartner INT NOT NULL AUTO_INCREMENT,
                                username VARCHAR(100) NOT NULL,
                                email VARCHAR(100) NOT NULL,
                                password VARCHAR(100) NOT NULL,
                                information VARCHAR(6000) NULL,
                                UNIQUE INDEX idPartner_UNIQUE (idPartner ASC) VISIBLE,
                                PRIMARY KEY (idPartner),
                                UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
                                UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE)`;
        var createLocationTable = `CREATE TABLE IF NOT EXISTS location (
                                idLocation INT NOT NULL AUTO_INCREMENT,
                                idPartner INT NOT NULL,
                                latitude DOUBLE NOT NULL,
                                longitude DOUBLE NOT NULL,
                                address VARCHAR(200) NOT NULL,
                                information VARCHAR(6000) NULL,
                                PRIMARY KEY (idLocation),
                                UNIQUE INDEX idLocations_UNIQUE (idLocation ASC) VISIBLE,
                                INDEX FK_PartnerLocation_idx (idPartner ASC) VISIBLE,
                                CONSTRAINT FK_PartnerLocation
                                  FOREIGN KEY (idPartner)
                                  REFERENCES partner (idPartner)
                                  ON DELETE CASCADE
                                  ON UPDATE NO ACTION)`;
        var createCurrencyTable = `CREATE TABLE IF NOT EXISTS currency (
                                idCurrency INT NOT NULL AUTO_INCREMENT,
                                name VARCHAR(50) NOT NULL,
                                PRIMARY KEY (idCurrency),
                                UNIQUE INDEX idCurrency_UNIQUE (idCurrency ASC) VISIBLE,
                                UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE)`;
        var createRateTable = `CREATE TABLE IF NOT EXISTS rate (
                            idRates INT NOT NULL AUTO_INCREMENT,
                            idLocation INT NOT NULL,
                            idCurrency INT NOT NULL,
                            date DATETIME NOT NULL,
                            value DECIMAL(10,6) NOT NULL,
                            PRIMARY KEY (idRates),
                            UNIQUE INDEX idRates_UNIQUE (idRates ASC) VISIBLE,
                            INDEX FK_LocationRate_idx (idLocation ASC) VISIBLE,
                            INDEX FK_CurrencyRate_idx (idCurrency ASC) VISIBLE,
                            CONSTRAINT FK_LocationRate
                              FOREIGN KEY (idLocation)
                              REFERENCES location (idLocation)
                              ON DELETE CASCADE
                              ON UPDATE NO ACTION,
                            CONSTRAINT FK_CurrencyRate
                              FOREIGN KEY (idCurrency)
                              REFERENCES currency (idCurrency)
                              ON DELETE CASCADE
                              ON UPDATE NO ACTION)`;
        var createTransactionsTable = `CREATE TABLE IF NOT EXISTS transactions (
                                      idTransaction INT NOT NULL AUTO_INCREMENT,
                                      idRate INT NOT NULL,
                                      idPartnerRate INT NULL,
                                      value DECIMAL(10,6) NOT NULL,
                                      PRIMARY KEY (idTransaction),
                                      UNIQUE INDEX idTransaction_UNIQUE (idTransaction ASC) VISIBLE,
                                      INDEX FK_RateTransaction_idx (idRate ASC) VISIBLE,
                                      INDEX FK_PartnerRateTransaction_idx (idPartnerRate ASC) VISIBLE,
                                      CONSTRAINT FK_RateTransaction
                                        FOREIGN KEY (idRate)
                                        REFERENCES rate (idRates)
                                        ON DELETE CASCADE
                                        ON UPDATE NO ACTION,
                                      CONSTRAINT FK_PartnerRateTransaction
                                        FOREIGN KEY (idPartnerRate)
                                        REFERENCES rate (idRates)
                                        ON DELETE CASCADE
                                        ON UPDATE NO ACTION);
`
        db.query(createPartnerTable, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Partner table checked/created successfully.');
          }
        });
        db.query(createLocationTable, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Location table checked/created successfully.');
          }
        });
        db.query(createCurrencyTable, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Currency table checked/created successfully.');
          }
        });
        db.query(createRateTable, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Rate table checked/created successfully.');
          }
        });
        db.query(createTransactionsTable, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('Transactions table checked/created successfully.');
          }
        });
      });
    });
  }
});

// make db accessible to your routes
app.use((req, res, next) => {
  req.db = db;
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/partner', partnerRouter);
app.use('/currency', currencyRouter);
app.use('/location', locationRouter);
app.use('/rate', rateRouter);
app.use('/transaction', transactionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
