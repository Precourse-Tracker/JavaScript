const mongoose = require('mongoose');
const User = require('../models/User.js');

module.exports = {

  loggedIn(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.send({
        redirect: 'login'
      });
    }
  },
  logoutUser(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },

  getUsers(req, res) {
    User.find({}, function(err, users) {
      console.log(users);
      res.status(200).send(users);
    })
  },

  currentUser(req, res, next) {
    if (req.user) {
      res.status(200).send(req.user);
    }
  }
}


// updateUser: function(req, res) {
//   User.findByIdAndUpdate(req.user, {$push: {wishlist: req.body.wishlist}}, function(err, resp) {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(resp);
//     }
//   });
// },
