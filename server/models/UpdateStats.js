var mongoose = require('mongoose');

var UpdateStatsSchema = new mongoose.Schema({
  lastUpdated: Date
})

mongoose.model('UpdateStats', UpdateStatsSchema);
