const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// look at using import instead or require
const assessmentSchema = new Schema({
  questions: [{
    question: {type: String, required: true, index: true},
    answer: {type: String, required: true, index: true}
  }],
  score: {type: Number}
})

module.exports = mongoose.model('Assessment', assessmentSchema);
