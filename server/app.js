var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    https = require('https'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// Create global app object
var app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname + '/client/build')));
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'skatecompare', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}
//mongodb:<dbuser>:<dbpassword>@ds129762.mlab.com:29762/heroku_p0dqrw89
if(isProduction){
//  mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.DB_CONNECTION_STRING)
} else {
  //mongoose.connect('mongodb://localhost/skatecompare');
  mongoose.connect(process.env.DB_CONNECTION_STRING);
  mongoose.set('debug', true);
}

//mongoose models here

require('./models/Impression');
require('./models/Brand');
require('./models/Product');
require ('./models/Image');
require('./models/Review');
require ('./models/Store');
require ('./models/Deal');
require ('./models/UpdateStats');
require ('./models/Feedback');
require('./models/CurrencyConversionRateDownload');


app.use(require('./routes'));

/// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
  console.log("app.use function");
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});
*/
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  console.log ("app.get function");
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
