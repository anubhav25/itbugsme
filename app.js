
var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var clientSessions = require("client-sessions");
var bodyParser = require('body-parser');
var users= require('./models/user');



var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, () => {
    console.log('listning')
});;
var dburl = 'mongodb://localhost/itbugsme';
/*dburl = 'mongodb://test:test@ds119129.mlab.com:19129/lifeshare'*/
dburl = 'mongodb://a:a@ds237669.mlab.com:37669/itbugsme'
mongoose.connect(dburl);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(clientSessions({

    secret: 'this_can_be_anything_but_not_this_or_this_but_anything', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    httpOnly: true,
    secure: true,
    ephemeral: true,

    activeDuration: 1000 * 60 * 15// if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds

}));

app.use(function(req, res, next) {
  //console.log(req.session_state.user)
  //console.log('req')
    if (req.session_state && req.session_state.user) {
        users.findOne({email: req.session_state.user.email},{_id : 0 , __v : 0},(err,user)=>{
        req.user = user;
         req.session_state.user = user;  //refresh the session value
         res.locals.user = user;
        });}
          next()
         });

app.use('/', index);
app.use('/admin',admin);

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
  console.log(err)
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


