var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

const Visitors = require('./data/visitors');
const Hosts = require('./data/hosts');
const Checkins = require('./data/checkins');

app.get('/v1/hosts', function(req, res, next) {
  res.json({
    statusCode: 200,
    message: "Successfully located users",
    data: Hosts.hosts
  });
});

app.get('/v1/visitors', function(req, res, next){
  res.json(Visitors.visitors);
});
app.post('/v1/visitors', function(req, res, next) {  
  
  const visitor = Visitors.create(req.body.firstName, req.body.lastName, req.body.companyName, req.body.mobile);
  res.json({
    statusCode: 200,
    message: "Successfully created visitor",
    data: visitor
  });
});

app.post('/v1/visitors/auth', function(req, res, next) {
  const exist = Visitors.exist(req.body.mobile);
  res.json({
    statusCode: 200,
    message: "The visitor sign-in code is not required.",
    data: {
      found: exist,
      verificationType: null
    }
  });
});

app.post('/v1/visitors/find', function(req, res, next) {
  Visitors.findByToken(req.body.mobile, req.body.token);
  res.json({
    statusCode: visitor ? 200 : 404,
    message: "Successfully located visitor",
    data: visitor
  })
});

app.put('/v1/visitors/:id', function(req, res, next) {  
  const visitor = Visitors.findByIdAndToken(parseInt(req.params.id), req.body.mobile, req.body.token);
  if (visitor){
    res.json({
      statusCode: 200,
      message: "Successfully update visitor",
      data: Visitors.update(        
        visitor, 
        req.body.firstName, 
        req.body.lastName, 
        req.body.companyName)
    });
  } else {
    res.json({
      statusCode: 404,
      message: "Can not located visitor",
      data: visitor
    });
  }
});

app.post('/v1/checkins', function(req, res, next) {
  const checkin = Checkins.checkin(req.body.visitorId, req.body.hostId, req.body.timeIn);  
  if (checkin) {
    res.json({
      statusCode: 200,
      message: "Successfully created checkin",
      data: checkin
    });
  } else {
    res.status(404);
    res.json({
      statusCode: 404,
      error: "Not Found",
      message: "Failed to locate checkin"
    })
  }
});

app.post('/v1/checkouts', function(req, res, next) {  
  const checkin = Checkins.checkout(req.body.signoutCode);
  if (checkin) {
    res.json({
      statusCode: 200,
      message: "Successfully updated checkin",
      data: checkin
    });
  } else {
    res.status(404);
    res.json({
      statusCode: 404,
      error: "Not Found",
      message: "Failed to locate checkin"
    });
  }
});

app.post('/v1/escalations', function(req, res, next) {
  res.json({
    "statusCode": 200,
    "message": "Successfully created escalations",
    "data": {
      "escalationPaths": []
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
