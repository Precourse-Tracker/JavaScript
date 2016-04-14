const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./server/models/User.js');
const secret = require('./server/secret.js');

///////CONTROLLERS/////////
const userController = require('./server/controllers/userController.js');
const unitController = require('./server/controllers/unitController.js');
const progressController = require('./server/controllers/progressController.js');



const app = express();
const port = 6969;
app.listen(port, () => console.log(`listening on port ${port}`));

///////////////////////////////
//CONNECTING TO THE DATABASE//
/////////////////////////////
mongoose.connect('mongodb://localhost/courseTracker');
mongoose.connection.once('open', () => console.log('connected to MongoDB'));

//////////LOGIN AUTH///////////
passport.use('local-login', new localStrategy({
    usernameField: 'username'
  },
  (username, password, cb) => {
    console.log("server", username, password);
    User.findOne({
      'username' : username
    }, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (!user.validatePassword(password)) {
        console.log(password);
        return cb(null, false);
      }
      console.log("user from service", user);
      return cb(user);
    });
  }));


  //////////SIGNUP AUTH//////////
  passport.use('local-signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },(req, username, password, done) => {
    console.log(req, username, password);
    User.findOne({
      'username': username
    },(err, user) => {
      console.log(user);
      if (err) return done(err);
      if (user) return done(null, false);
      else {
        console.log(req.body);
        var newUser = new User(req.body);
        newUser.password = newUser.generateHash(req.body.password);
        newUser.save((err, response) => {
          if (err) return done(null, err);
          else return done(null, response);
        });
      }
    });
  }));

  passport.serializeUser((user, cb) => {
    console.log('user here is ', user)
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findById(id, function(err, user) {
      if (err) {
        return cb(err);
      }
      console.log('Going back with', user);
      cb(null, user);
    });
  });

  /////////MIDDLEWARE///////////
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(session({
  secret: secret.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


///////////////API AUTH////////////

app.post('/api/login', passport.authenticate('local-login', { failureRedirect: '/login'}), function(req, res) {
  res.status(200).send({msg: 'okay!', user: req.session.passport});
});

app.post('/api/signup', passport.authenticate('local-signup'), function(req, res){
  console.log('Successfully created user');
  res.status(200).json(req.body);
});


//////progress tracker data//////
app.get('/api/tracker', progressController.getTrackerData);


///////////LOGOUT USER//////////
app.get('/logout', userController.logoutUser);




/////////////Creating Data///////
app.post('/api/lessons', unitController.createLesson);
app.post('/api/assessment', unitController.createAssessment);
app.post('/api/unit', unitController.createUnit);


//////////CHECK IF USER EXISTS////////
app.get('/api/users', userController.getUsers);
