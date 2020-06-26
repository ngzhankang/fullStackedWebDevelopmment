var createError = require('http-errors');
var express = require('express');
// declare required libraries
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');

var app = express();

// use required libraries
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // POST insert api for performance
// app.post('/basic/insert/Performance', function (req, res, next) {
//   const { data } = req.body;
//   database.insertPerformance(data, (error, result) => {
//     if (error) {
//       console.log(error)
//       return next(error);
//     }
//     console.log(result);
//     res.json(data);
//   });
// });

// POST for festivalId first then performanceId
app.post('/basic/insert', function (req, res, next) {
  const { data } = req.body;

  if(data.length === 0) {
    res.json({result: "Success!", code: 200})
  }
  for(var i = 0; i < data.length; i++){
    // check that each entry has all the fields
    // check for entries that doesn't have all the fields
    if(data[i].festivalId == undefined || data[i].performanceId == undefined || data[i].startTime == undefined || data[i].endTime == undefined)
    // return error
    return res.json({error: 'Invalid data', code: 400})
  }
  database.insertFestival(data, (error, result) => {
    if (error) {
      console.log(error)
      return next(error);
    }
    // if insertFestivalId pass, proceed to insertPerformance
    database.insertPerformance(data, (error2, result2) => {
      if (error2) {
        console.log(error2);
        return next(error2);
      }
    res.json({result: "success"});
    })
  });
});

// GET method data viewer filter api
app.get('/basic/data/', function (req, res, next) {
  const { festivalId, startTime, page, pageSize } = req.query;
  database.getFestivals(festivalId, startTime, page, pageSize, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
})

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
  res.json({
    error: err.message,
    code: err.status || 500,
  });
});

module.exports = app;
