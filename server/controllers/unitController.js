const mongoose = require('mongoose');
const User = require('../models/User.js');
const Lesson = require('../models/Lesson.js');
const JSAssessment = require('../models/JSAssessment.js');
const Unit = require('../models/Unit.js');

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
    var assessment = new JSAssessment(req.body);
    assessment.save(function(err, resp) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send(resp)
      }
    })
  },
  createUnit(req, res, next) {
    var unit = new Unit(req.body);
    unit.save(function(err, resp) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    })
  },
  getJSAssessment(req, res, next) {
    JSAssessment.find({}).populate("questions").exec((err, assessment) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(assessment);
      }
    })
  }










}
