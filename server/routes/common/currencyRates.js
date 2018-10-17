let money = require('money');
let axios = require('axios');
let mongoose = require('mongoose');

let CurrencyConversionRateDownload = mongoose.model('CurrencyConversionRateDownload');

const currencyFunctions = {
  getUpdateCurrencyRates : async function(refreshInterval = 21600000) {
    //checks the latest currency rates doanload, if older than refreshInterval, updates
    return new Promise(async function(resolve, reject) {
      let ccrd = await CurrencyConversionRateDownload.findOne({}, {}, { sort : { 'updatedAt' : 1} });
      let conversionRatesAge = 0;
      if (ccrd) {
        let date = new Date();
        conversionRatesAge = date.getTime() - ccrd.updatedAt.getTime();
      }
      if (conversionRatesAge > refreshInterval || !ccrd) {
        axios.get('https://openexchangerates.org/api/latest.json?app_id='+process.env.OPEN_EXCHANGE_API_KEY).then(async function(response) {

          //console.log(response);

          //find latest updated ccrd object in db, update rates
          if (!ccrd) ccrd = new CurrencyConversionRateDownload();
          ccrd['base'] = 'USD';
          ccrd['rates'] = [];

          //add rates
          Object.keys(response.data.rates).forEach(function(key) {
            let rateObject = {
              currency : key,
              rate : response.data.rates[key]
            }
            ccrd.rates.push(rateObject);
          })
          ccrd.save().then(function(ccrd) {
            resolve(ccrd);
          }).catch(function(error) {
            reject(error);
          })
        }).catch(function(error) {
          console.log("CURRENCY CONVERSION AXIOS GET ERROR");
          console.log(error);
          resolve(ccrd);
        })
      }
      else {   //use existing ccrd
        resolve(ccrd);
      }
      return;
    })
  },
  convertCurrency: async function(amount, from, to) {
    let getPairsRate = this.getPairsRate.bind(this);
    return new Promise(async function(resolve, reject) {
      const conversionRate = await getPairsRate(from, to);
      resolve(amount * conversionRate);
    })
  },
  getPairsRate : async function(from, to) {
  //  var self = this;
    let getUpdateCurrencyRates = this.getUpdateCurrencyRates.bind(this);
    let getCurrencyValue = this.getCurrencyValue.bind(this);


    return new Promise(async function(resolve, reject) {
      let ccrd = await getUpdateCurrencyRates();
      if (!ccrd) return null;
      let fromRate = getCurrencyValue(from, ccrd);
      let toRate = getCurrencyValue(to, ccrd);
      let conversionRate = toRate / fromRate;
      resolve(conversionRate);
    })
  },
  getCurrencyValue : function(currencyString, ccrd) {
    let currencyObject = ccrd.rates.find(function(obj) {
      return obj.currency.toUpperCase() == currencyString.toUpperCase();
    })
    if (!currencyObject) return 1;
    return currencyObject.rate;
  },
}
module.exports = currencyFunctions;
