const mongoose = require('mongoose');
const User = require('../models/User.js');
const Lesson = require('../models/Lesson.js');
const Assessment = require('../models/Assessment.js');

module.exports = {
  createLesson(req,res, next) {
    var lesson = new Lesson(req.body);
    lesson.save(function(err, resp) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send(resp)
      }
    })
  },
  createAssessment(req,res, next) {
    var assessment = new Assessment(req.body);
    assessment.save(function(err, resp) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send(resp)
      }
    })
  }










}
