const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  lesson: [{
    lesson: {type: Schema.Types.ObjectId, ref: 'Lesson'}
  }],
  assessment: {type: Schema.Types.ObjectId, ref: 'Assessment'}
})

module.exports = mongoose.model('Unit', unitSchema);
