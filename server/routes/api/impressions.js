var router = require('express').Router();
var mongoose = require('mongoose');

let Impression = mongoose.model('Impression');
let Product = mongoose.model('Product');

router.get('/', async function(req, res, next) {
  Impression.find({}).then(function(impressions) {
    return res.json(impressions);
  }).catch(next);
})

router.post('/', async function(req, res, next) {
  Product.findOne({slug : req.body.product}).populate('impressions.impression').then(async function(product, error) {

    if (!product) return res.json({error : error})
    if (!product.toObject().hasOwnProperty('impressions')) {
      product.impressions = [];
    }

    let productHasImpression = false;
    let impressionSearch = product.impressions.filter(function(imp) {
      return imp.impression.customId == req.body.impression;
    })

    if (impressionSearch.length > 1) {
      return res.json({ error : "Something went wrong! "})
    }

    else if (impressionSearch.length == 0) {
      //add impression
      productHasImpression = false;
      let impressionObject = {};
      let impression = await Impression.findOne({ customId: req.body.impression}).exec();
      impressionObject.impression = impression
      impressionObject.votes = {
        yes : 0,
        no : 0
      }

      impressionSearch.push(impressionObject);
    } else if (impressionSearch.length == 1) productHasImpression = true
    //adjust impression
    for (var key in req.body.change) {

      if (Math.abs(req.body.change[key]) < 2) {
        impressionSearch[0]['votes'][key] += Number(req.body.change[key])
      } else {
        return res.json({error: "value must be between 1 and -1"})
      }
    }
    console.log(impressionSearch[0])
    //update product
    if (!productHasImpression) product.impressions.push(impressionSearch[0])

    else { //replace existing impression
      product.impressions.forEach(function(imp, i) {
        if (product.impressions[i].impression.customId == impressionSearch[0].impression) {
          product.impressions[i].votes = impressionSearch[0].votes;
        }
      })
    }
    product.save().then(function(_product) {
      return res.json(impressionSearch[0]);
    })


  })
})

module.exports = router;
