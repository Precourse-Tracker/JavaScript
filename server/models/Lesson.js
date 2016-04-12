const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: {type: String},
  questions: [{
    question: {type: String, required: true, index: true},
    answer: {type: String, required: true, index: true},
  }],
  score: {type: Number}
})

module.exports = mongoose.model('Lesson', lessonSchema);
