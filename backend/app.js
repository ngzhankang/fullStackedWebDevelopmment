var createError = require('http-errors');
var express = require('express');
// declare required libraries
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');
// const algorithm = require('./algorithm')

var app = express();

// use required libraries
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint for Performance table(OK)
app.post('/basic/insert/', function (req, res, next) {
  const { data } = req.body;

  if(data.length === 0) {
    res.json({result: "Success!", code: 200})
  }
  else {
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
  }
});

// POST for PerformanceWithPopularity table(OK)
app.post('/advanced/insert/', function (req, res, next) {
  const { data } = req.body;

  if (data.length === 0) {  // if nothing in input, return success message
    res.json({result: "success", code: 200})
  }
  else {
    for (var i = 0; i < data.length; i++) { // check that each entry has all the fields
      if(data[i].festivalId == undefined || data[i].performanceId == undefined || data[i].startTime == undefined || data[i].endTime == undefined || data[i].popularity == undefined) // check for entries that doesn't have all the fields
      return res.json({error: 'Invalid data', code: 400}) // return error if check fail
    }
    database.insertFestival(data, (error, result) => {  // insert festivalId
      if (error) {
        console.log(error)
        return next(error);
      }
      database.insertPopularity(data, (error2, result2) => { // insert performanceId
        if (error2) {
          console.log(error2);
          return next(error2);
        }
      res.json({result: "success"});
      })
    });
  }
});

// GET endpoint for Performance table(OK)
app.get('/basic/data/', function (req, res, next) {
  const { festivalId, startTime, page, pageSize } = req.query;
  database.getFestivals(festivalId, startTime, page, pageSize, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

// GET for PerformanceWithPopularity table
app.get('/advanced/data/', function (req, res, next) {
  const { festivalId, startTime, page, pageSize } = req.query;  // read the data from the browser
  database.getPopularity(festivalId, startTime, page, pageSize, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

// 404 Error Handler(OK)
app.use(function (req, res, next) {
  next(createError(404));
});

// 500 Error Handler(OK)
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