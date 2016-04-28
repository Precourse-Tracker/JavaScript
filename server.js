const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./server/models/User.js');
// const secret = require('./server/secret.js');
const secret = process.env.SECRET

///////CONTROLLERS/////////
const userController = require( './server/controllers/userController.js' );
const unitController = require( './server/controllers/unitController.js' );
const progressController = require( './server/controllers/progressController.js' );



const app = express();
// const port = 6969;
const port = 80;
// app.listen(port, () => console.log(`listening on port ${port}`));
app.listen(process.env.PORT, () => console.log(`listening on port ${port}`));

///////////////////////////////
//CONNECTING TO THE DATABASE//
/////////////////////////////

// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => console.log('connected to Heroku and mLab'));

/////////MIDDLEWARE///////////
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(session({
// secret: secret.secret,
secret: secret, //Heroku
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//////////LOGIN AUTH///////////
passport.use( 'local-login', new localStrategy( {
    usernameField: 'username'
  },
  ( username, password, cb ) => {
    User.findOne( {
      'username': username
    }, function ( err, user ) {
      if ( err ) {
        return cb( err );
      }
      if ( !user ) {
        return cb( null, false );
      }
      if ( !user.validatePassword( password ) ) {
        return cb( null, false );
      }
      cb(null, user);
    });
  });


//////////SIGNUP AUTH//////////
passport.use( 'local-signup', new localStrategy( {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, ( req, username, password, done ) => {
  User.findOne( {
    'username': username
  }, ( err, user ) => {
    if ( err ) return done( err );
    if ( user ) return done( null, false );
    else {
      var newUser = new User( req.body );
      newUser.password = newUser.generateHash( req.body.password );
      newUser.save( ( err, response ) => {
        if ( err ) return done( null, err );
        else return done( null, response );
      } );
    }
  } );
} ) );

passport.serializeUser( ( user, cb ) => {
  cb( null, user.id );
} );

passport.deserializeUser( ( id, cb ) => {
  User.findById( id, function ( err, user ) {
    if ( err ) {
      return cb( err );
    }
    cb( null, user );
  } );
} );

///////////////API AUTH////////////
app.post( '/api/login', passport.authenticate( 'local-login', {
  failureRedirect: '/login'
} ), function ( req, res ) {
  res.status( 200 ).send( {
    msg: 'okay!',
    user: req.session.passport
  } );
} );

app.post( '/api/signup', passport.authenticate( 'local-signup' ), function ( req, res ) {
  res.status( 200 ).json( req.body );
} );


//////progress tracker data//////
app.get( '/api/tracker', progressController.getTrackerData );

///////////LOGOUT USER//////////
app.get( '/logout', userController.logoutUser );

//////////GET DATA////////////
app.get('/api/assessment/js', unitController.getJSAssessment);
app.get('/api/lessons/js', unitController.getJSLesson);
app.get('/api/users/progress', unitController.getUserData);
app.get( '/api/lessons/js/:lessonName', unitController.getJSLesson );
app.get( '/api/users/', userController.getUsers );

/////////UPDATING USER////////
app.put( '/api/users/', userController.updateUser );
app.put('/api/lessons/progress', userController.updateProgress);

/////////////Creating Data///////
app.post('/api/lessons', unitController.createLesson);
app.post('/api/assessment/js', unitController.createAssessment);
app.post('/api/unit', unitController.createUnit);


//////////CHECK IF USER EXISTS////////
app.get('/api/users', userController.getUsers);

//////////GET CURRENT LOGGED IN USER////////
app.get('/user/current', userController.currentUser);
