var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ImpressionSchema = new mongoose.Schema({
  content: {type: String, unique: true},
  customId: Number,
  connotation: {type: String, enum: ['positive', 'negative', 'neutral']}
})

mongoose.model('Impression', ImpressionSchema);
