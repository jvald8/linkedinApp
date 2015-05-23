'use strict';

var express = require('express'),
passport = require('passport'),
LinkedInStrategy = require('passport-linkedin').Strategy,
session = require('express-session'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
methodOverride = require('method-override'),
logger = require('morgan'),
database = require('./database.js'),
helperFunctions = require('./helperFunctions.js');

var app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));

var hostname = 'http://localhost:3000';

var LINKEDIN_API_KEY = '',
LINKEDIN_SECRET_KEY = '';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: hostname + '/auth/linkedin/callback',
  },
  function(token, tokenSecret, profile, done) {
    /*User.findOrCreate({ linkedin: profile.id}, function (err, user) {
      return done(err, user);
    })*/
    return done(null, profile);
    console.log('this is the users returned profile: ' + profile);
  }
));

app.get('/auth/linkedin',
  passport.authenticate('linkedin', {scope: ['r_basicprofile', 'r_emailaddress']}));

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)?format=json');
  });

app.get('/', function(req, res) {
  if(req.session && req.session.passport && req.session.passport.user) {
    req.session.currentUserEmail = req.session.passport.user._json.email;

    res.redirect('/');
  }
  console.log('if they didnt get the permissions, send back to facebook, maybe error page')
  res.redirect('/auth/linkedin');
});

app.use(helperFunctions.ensureAuthenticated);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/welcome', function(req, res) {
  console.log(req.user);
  res.send('temp page to break redirect loop');
})

app.get('/extraInformation', function(req, res) {
  res.redirect('https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)?format=json');
})

app.listen(3000, function() {
  console.log('Im on port 3000!');
});


