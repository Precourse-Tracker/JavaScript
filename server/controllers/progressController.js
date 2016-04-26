const mongoose = require('mongoose');
const User = require('../models/User.js');

module.exports = {
  getTrackerData(req, res, next) {
    User.findById('5716b6e1d0fe9a41612a3783').populate('progress').exec(function(err, progress){
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send(progress)
      }
    })
  }




}
