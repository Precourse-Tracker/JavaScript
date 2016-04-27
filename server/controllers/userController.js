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
                res.status(200).send(users);
            })
        },

        currentUser(req, res, next) {
            if (req.user) {
                res.status(200).send(req.user);
            }
        },
      updateUser(req, res) {
        var assessment = req.body.progress.jsAssessment;
          User.findByIdAndUpdate( req.user, {
            progress: {
              jsAssessment: assessment
            }
        },
        function(err, resp) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.status(200).send(resp);
          }
        })
      },
      updateProgress(req, res) {
        var lesson = req.body.lessonName;
        var newScore = req.body.score;
        var userId = req.body.currentUserId;
        User.findById(userId, function(err, response){
          if (response.progress.lessons.length === 0) {
            response.progress.lessons.push({name: lesson, score: newScore});
            response.save();
          }
          else if (response.progress.lessons.length > 0){
            var lessonExists = false;
            response.progress.lessons.forEach(function(thisLesson) {
              if (thisLesson.name === lesson) {
                thisLesson.score = newScore;
                response.save();
                lessonExists = true;
              }
            })
            if (!lessonExists) {
              response.progress.lessons.push({name: lesson, score: newScore});
              response.save();
            }
          }
        })
      }
    }
