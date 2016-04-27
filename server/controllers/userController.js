const mongoose = require( 'mongoose' );
const User = require( '../models/User.js' );

module.exports = {

  loggedIn( req, res, next ) {
    if ( req.user ) {
      next();
    } else {
      res.send( {
        redirect: 'login'
      } );
    }
  },
  logoutUser( req, res, next ) {
    req.logout();
    req.session.destroy();
    res.redirect( '/' );
  },

  getUsers( req, res ) {
    console.log( 'Query: ', req.query );
    User.find( req.query )
      .exec( function ( err, message ) {
        if ( err ) {
          console.log( err );;
          res.status( 500 )
            .send( err );
        }
        res.status( 200 )
          .send( message );
      } );
  },

  currentUser( req, res, next ) {
    if ( req.user ) {
      res.status( 200 ).send( req.user );
    }
  },

  updateUser( req, res ) {
    var assessment = req.body.progress.jsAssessment;
    console.log( 'backend ctrl', assessment );
    console.log( req.user );
    User.findByIdAndUpdate("57150955710833b8272b9b2f", {
      progress: {
        jsAssessment: assessment
      }
    }, function ( err, resp ) {
      if ( err ) {
        res.status( 500 ).send( err );
      } else {
        res.status( 200 ).send( resp );
      }
    } )
  }
}
