const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    question1: String,
    question2: String,
    question3: String,
    email:String
  });

module.exports = mongoose.model('survey', surveySchema);