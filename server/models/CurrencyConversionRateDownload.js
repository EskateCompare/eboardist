var mongoose = require('mongoose');

var CurrencyConversionRateDownloadSchema = new mongoose.Schema({
  base: String, //base currency
  rates: [{ currency : String,
            rate: Number}]
}, { timestamps : { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

mongoose.model('CurrencyConversionRateDownload', CurrencyConversionRateDownloadSchema);
