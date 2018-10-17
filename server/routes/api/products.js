var router = require('express').Router();
var mongoose = require('mongoose');
var pipeline = require('./pipelines/product-aggregation.js');
var currencyRates = require('../common/currencyRates');

var Product = mongoose.model('Product')
let Impression = mongoose.model('Impression');

router.get('/:slug', async function(req, res, next) {

  let product = await Product.findOne({ slug : req.params.slug }).populate('brand').populate('deals').
  populate('reviews').populate('image').populate('additionalImages').
  populate({ path: 'deals', populate: { path: 'store' }}).
  populate('impressions.impression').lean().exec();

  if (!product) return res.status(422).json({ 'error' : 'product not found' });

  //get rankings

  let products = await Product.find({}, 'ratings.compositeScore style brand').exec();

  let brandRank = 1;
  let styleRank = 1;
  let overallRank = 1;

  products.forEach(function(compareProd) {
    if (compareProd.ratings.compositeScore > product.ratings.compositeScore) {
      overallRank++;
      if (compareProd.style == product.style) {
        styleRank++;
      }
      if (String(compareProd.brand) == String(product.brand)) {
        brandRank++;
      }
    }
  })

  product['rankings'] = {
    overall : overallRank,
    style : styleRank,
    brand : brandRank
  }
  let productDeals = [];

  let productDealsPromises = product.deals.map(async function(deal) {
    return new Promise(async function(resolve, reject) {
    if (deal.currency != "USD" && deal.currency != "") {
      deal.convertedSalesPrice = await currencyRates.convertCurrency(deal.salesPrice, deal.currency, "USD");
      deal.convertedOriginalPrice = await currencyRates.convertCurrency(deal.originalPrice, deal.currency, "USD");
      productDeals.push(deal);
      resolve();
    } else {
      deal.convertedSalesPrice = deal.salesPrice;
      deal.convertedOriginalPrice = deal.originalPrice;
      productDeals.push(deal);
      resolve();
    }
    })
  })
  await Promise.all(productDealsPromises);

  product.deals = productDeals;

  console.log(product.deals);

  product.deals = product.deals.sort(function(a, b) {
    return a.salesPrice - b.salesPrice;
  })
  product.reviews = product.reviews.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  })

  //front-end mapping

  const frontEndMap = {
    "dbKey" :        ["year",        "terrain", "style",  "deckMaterials",     "drive",        "range",                  "speed",  "weight",       "maxWeight",    "batteryPower",               "hillGrade",                "speedModes",       "batteryCapacity",          "batteryWattHours",        "chargeTime",            "width",                       "length",                   "wheelDiameter",  "manufacturerWarranty",   "tags"],
    "valueUnit" :    ["",               "",       "",            "",                "",         "miles",                   "mph",     "lbs",          "lbs",         "watts",                    "%",                            "",                   "mAh",                       "Wh",                    "minutes",          "inches",                       "inches",                    "mm",                    "months",        ""],
    "displayName" :  ["Year",        "Terrain", "Style",  "Deck Material",      "Motor",       "Range",                  "Speed",  "Weight",       "Max Load",      "Wattage",                   "Hill Grade",                "Speed Modes",      "Battery Capacity",         "Battery WattHours" ,      "Charge Time",          "Width",                       "Length",                    "Wheel Diameter",  "Manufacturer Warranty",  "Features"],
    "semanticIcon" : ["calendar check outline",   "road",    "adjust", "diamond", "power off", "map marker alternate", "dashboard", "balance scale", "weight",  "lightning",    "external square alternate",             "numbered list",    "battery three quarters",   "battery three quarters",       "time",                 "arrows alternate horizontal", "arrows alternate vertical", "dot circle",            "tty",                 "tags"]
  }

  var displaySpecs = [];

  for (var i = 0; i < frontEndMap.dbKey.length; i++) {
    var dbKey = frontEndMap.dbKey[i];
    var valueUnit = frontEndMap.valueUnit[i];
    var displayName = frontEndMap.displayName[i];
    var semanticIcon = frontEndMap.semanticIcon[i];

    var displaySpecObject = {};
    displaySpecObject["displayName"] = displayName;
    displaySpecObject["icon"] = semanticIcon;
    displaySpecObject["value"] = product.specs[dbKey] ? product.specs[dbKey] + " " + valueUnit : "?";

    displaySpecs.push(displaySpecObject);
  }

  product["displaySpecs"] = displaySpecs;

  //populate impressions



  let impressions = [];
  impressions = await Impression.find({});
  console.log(typeof(impressions));
  //console.log(impressions);

  Object.keys(impressions).forEach(function(key) {
    let impression = impressions[key];
    let impressionFoundInProduct = false;
    product.impressions.forEach(function(productImpression) {
      if (productImpression.impression.customId == impression.customId) impressionFoundInProduct = true;
    })
    if (!impressionFoundInProduct) {
      product.impressions.push({
        impression: impression,
        votes: {
          yes: 0,
          no: 0
        }
      })
    }
  })


  return res.json({ product });

})

router.get('/', async function(req, res, next) {
  //Replace this find with filter function

  const params = req.query;

  pipeline.aggregationFilter(params, true).then(function(products) {
    return res.json({ products })
  })
  /*
  Product.find({}).select('-reviews').populate('brand').populate('deals').populate('image').exec().then(function(products) {
    return res.json({ products })
  })*/
})


module.exports = router;
