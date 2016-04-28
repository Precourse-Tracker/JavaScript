const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: {type: String},
  questions: [{
    question: {type: String, required: true, index: true},
    multipleChoice: {type: Array},
    correctAnswer: {type: String, required: true, index: true},
  }],
  video: {type: String, required: true},
  practice: [{
    question: {type: String, required: true, index: true},
    correctAnswer: {type: String, required: true}
  }],
  score: {type: Number}
})

module.exports = mongoose.model('Lesson', lessonSchema);

// https://www.youtube.com/watch?v=eyAqrXrG_3s
// https://youtu.be/0cnFGUzGFvY
