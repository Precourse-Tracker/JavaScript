const mongoose = require('mongoose');
const User = require('../models/User.js');

module.exports = {
  getTrackerData(req, res, next) {
    User.findById('570c59c9975eaf7a0e1dccc7').populate('progress').exec(function(err, progress){
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send(progress)
      }
    })
  }




}
