var createError = require('http-errors');
var express = require('express');
// declare required libraries
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');
const { compute } = require('./algorithm');
const { computeAdvance } = require('./algorithm');

var app = express();

// use required libraries
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint for Performance table(OK)(INSERT DATA)
app.post('/basic/insert', function (req, res, next) {
  const { data } = req.body;

  if (data.length === 0) {
    res.json({ result: "Success!", code: 200 })
  }
  else {
    for (var i = 0; i < data.length; i++) {
      // check that each entry has all the fields
      // check for entries that doesn't have all the fields
      if (data[i].festivalId == undefined || data[i].performanceId == undefined || data[i].startTime == undefined || data[i].endTime == undefined) {
        return res.json({ error: 'Invalid data', code: 400 })
      }
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
          return res.json({error: error2.error, code: error2.code})
        }
        return res.json({ result: "success" });
      })
    });
  }
});

// POST for PerformanceWithPopularity table(OK)(INSERT DATA)
app.post('/advance/insert', function (req, res, next) {
  const { data } = req.body;

  if (data.length === 0) {  // if nothing in input, return success message
    res.json({ result: "success", code: 200 })
  }
  else {
    for (var i = 0; i < data.length; i++) { // check that each entry has all the fields
      if (data[i].festivalId == undefined || data[i].performanceId == undefined || data[i].startTime == undefined || data[i].endTime == undefined || data[i].popularity == undefined) // check for entries that doesn't have all the fields
        return res.json({ error: 'Invalid data', code: 400 }) // return error if check fail
    }
    database.insertFestival(data, (error, result) => {  // insert festivalId
      if (error) {
        console.log(error)
        return next(error);
      }
      database.insertPopularity(data, (error2, result2) => { // insert performanceId
        if (error2) {
          console.log(error2);
          return res.json({error: error2.error, code: error2.code})
        }
        return res.json({ result: "success" });
      })
    });
  }
});

// GET endpoint to handle empty paths
app.get('/', (req, res) => {
  return res.json({
    message: "Welcome to JiBaBoom - skrtttt",
    availableEndpoints: [
      'POST /basic/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
      'POST /advance/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
      'GET /basic/result?para1=value1&para2=value2',
      'GET /advance/result?para1=value1&para2=value2',
    ]
  });
});

// GET endpoint for either Performance or PerformanceWithPopularity table(OK)(DATA VIEWER)
app.get('/:type/data', function (req, res, next) {
  const { type } = req.params;
  const { festivalId, startTime, endTime, page, pageSize } = req.query;
  const typeEnum = { BASIC: 'basic', ADVANCE: 'advance' };
  const callback = (error, result) => { if (error) return next(error); else return res.json(result); }

  if (type === typeEnum.BASIC) return database.getFestivals(festivalId, startTime, page, pageSize, callback);
  else if (type === typeEnum.ADVANCE) return database.getPopularity(festivalId, startTime, endTime, page, pageSize, callback);
  else return next({ error: "Unknown Type", code: 400 });
});

// GET endpoint for either Performance or PerformanceWithPopularity table(RESULT VIEWER)
app.get('/:type/result', async (req, res, next) => {
  const { type } = req.params;
  const typeEnum = { BASIC: 'basic', ADVANCE: 'advance' };

  let result;
  if (type === typeEnum.BASIC) {
    result = await compute(req.query.festivalId);
  }
  else if (type === typeEnum.ADVANCE) {
    if (req.query.festivalId === null || req.query.festivalId === undefined) return next(createError(400, 'invalid festivalId'))
    result = await computeAdvance(req.query.festivalId);
  }
  else return next({ error: "Server Error", code: 500 });
  // if (result[0] === undefined) { 
  //   return next({ error: "Server Error", code: 500}) 
  // }
  res.json(result)
});

// GET endpoint to reset all the tables
app.get('/reset', function (req, res) {
  database.resetAllTable(function (err, result) {
    if (err) {
      return res.json({ error: err });
    }
    else {
      return res.json({ result: result });
    }
  });
})

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