var mongoose = require('mongoose');

var FeedbackSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  content: {type: String, required: true, unique: true},
})

mongoose.model('Feedback', FeedbackSchema);
