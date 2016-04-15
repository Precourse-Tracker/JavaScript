const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsAssessmentSchema = new Schema({
  questions: [{
    question: {type: String, required: true, index: true},
    answer: {type: String, required: true, index: true}
  }]
})

module.exports = mongoose.model('JSAssessment', jsAssessmentSchema);
