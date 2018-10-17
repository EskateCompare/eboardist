var mongoose = require('mongoose');
var Product = mongoose.model('Product')
var _ = require('lodash');
var currencyRates = require('../../common/currencyRates');
var dottie = require('dottie');

exports.aggregationFilter = function (params, doSkipLimit, paramsSkipArray) {
  return new Promise(async function(resolve, reject) {

    const sortByDefault = "ratings.compositeScore";
    const sortDirDefault = -1;
    const pageNumDefault = 1;
    const perPageDefault = 100;

    var pipeline = []
      //initial match

      var initialMatch = {};

      //within range

      var rangeMatchesParams =     ["batteryCapacity",      'rating',                 'length',        'width',      'weight',       'speed',       'range',        'maxWeight',      'batteryPower',       'batteryWattHours',       'chargeTime',       'trucksWidth',      'wheelbaseLength',       'wheelDiameter',       'manufacturerWarranty',       'hillGrade'];
      var rangeMatchesLookupKeys = ["specs.batteryCapacity", 'ratings.compositeScore', 'specs.length', 'specs.width', 'specs.weight', 'specs.speed', 'specs.range', 'specs.maxWeight','specs.batteryPower', 'specs.batteryWattHours', 'specs.chargeTime', 'specs.trucksWidth','specs.wheelbaseLength', 'specs.wheelDiameter', 'specs.manufacturerWarranty', 'specs.hillGrade'];

      for (var i = 0; i < rangeMatchesParams.length; i++) {

        if (!params.hasOwnProperty(rangeMatchesParams[i])) {
          continue;
        }
        if (_.includes(paramsSkipArray, rangeMatchesParams[i])) {
          continue;
        }

        let rangeMatch = {};

        var rangeArray = [];
        var rawParams = params[rangeMatchesParams[i]];
        rangeArray = rawParams.split(',');   // list like 0-250,400-600
        //make list of or conditions

        //or condition pairs array
        let rangeMatchConditions = [];
         rangeArray.forEach(function(minMaxPair) {
          minMaxPair = minMaxPair.split('-');
          let matchObject = {};
          if (minMaxPair.length > 1) {
            matchObject[rangeMatchesLookupKeys[i]] = { $gte : Number(minMaxPair[0]), $lt : Number(minMaxPair[1]) }
          } else {
            minMaxPair[0] = minMaxPair[0].split('+')[0];
            matchObject[rangeMatchesLookupKeys[i]] = { $gte : Number(minMaxPair[0]) }
          }
          rangeMatchConditions.push(matchObject)
        })
        rangeMatch = { $or : rangeMatchConditions  }

        pipeline.push({
          $match :  rangeMatch
        })
      }

      //multi-match discrete

      var discreteMatchesParams =       ["drive"       , "terrain",      "style",       'deckMaterials',        'year',       'speedModes']
      var discreteMatchesLookupKeys =   ["specs.drive" , "specs.terrain", "specs.style", 'specs.deckMaterials', 'specs.year', 'specs.speedModes' ]
      var discreteMatchesTypes =        ["strings"      , "strings",       "strings",     'strings',             'numbers',   'numbers']

      for (var i = 0; i < discreteMatchesParams.length; i++) {


        if (!params.hasOwnProperty(discreteMatchesParams[i])) {
          continue;
        }

        if (_.includes(paramsSkipArray, discreteMatchesParams[i])) {
          continue;
        }

        var rawParams = params[discreteMatchesParams[i]];


        var valuesArray = [];
        valuesArray = rawParams.split(',');

        var valueType = discreteMatchesTypes[i];

        if (valueType == "boolean") {
          valuesArray = valuesArray.map(function(value) {
            if (value == "false") return false;
            else return true;
          })
        }
        else if (valueType == "numbers") {
          valuesArray = valuesArray.map(function(value) {
            return Number(value);
          })
        }
        initialMatch[discreteMatchesLookupKeys[i]] = {
          $in : valuesArray
        }
      }

      pipeline.push({
        $match :  initialMatch
      })

      var andMatchesParams =       ["features" ]
      var andMatchesLookupKeys =   ["specs.tags"  ]
      var andMatchesTypes =        ["strings"]

      let andMatch = {};

      for (var i = 0; i < andMatchesParams.length; i++) {

        //AND MATCHES
        if (!params.hasOwnProperty(andMatchesParams[i])) {
          continue;
        }

        if (_.includes(paramsSkipArray, andMatchesParams[i])) {
          continue;
        }

        var rawParams = params[andMatchesParams[i]];
        var valuesArray = [];
        valuesArray = rawParams.split(',');

        andMatch[andMatchesLookupKeys[i]] = {
          $all : valuesArray
        }

      }

      pipeline.push({
        $match : andMatch
      })

      //brands lookup

      pipeline.push(
        {
          $lookup: {
            from: 'brands',
            localField: 'brand',
            foreignField: '_id',
            as: 'brand'
          }
        }
      )

      //match brand

      var brandsParamArray = [];

      if (params.hasOwnProperty('brands') && !_.includes(paramsSkipArray, 'brands'))
      {


        var rawBrands = params.brands;
        brandsParamArray = rawBrands.split(',');

        pipeline.push(
          {
            $match: {
              "brand.name": {
                $in: brandsParamArray
              }
            }
          }
        )
      }

      //lookup deals

      pipeline.push(
        {
          $lookup: {
            from: 'deals',
            localField: 'deals',
            foreignField: '_id',
            as: 'deals'
          }
        }
      )


      //Add discount && popularity fields

      pipeline.push(
        {
          $addFields: {
            popularity: {
              $sum: [
                "$ratings.external.amount", "$ratings.internal.amount"
              ]
            }
          }
        }
      )
      /*
      //Sort

      let sortKey = sortByDefault; //default

      var sortParam = params.sortBy;

      if (params.sortBy == 'popularity') sortKey = 'popularity';
      if (params.sortBy == 'price') sortKey = 'bestPrice';
      if (params.sortBy == 'rating') sortKey = 'ratings.compositeScore';
      if (params.sortBy == 'discount') sortKey = 'discount';
      if (params.sortBy == 'speed') sortKey = 'specs.speed';
      if (params.sortBy == 'range') sortKey = 'specs.range';

      var sortDir = params.sortDir;
      var sortDirParam = sortDirDefault;
      if (sortDir == 'asc') sortDirParam = 1;

      let sortObject = {};

      sortObject[sortKey] = Number(sortDirParam);

      pipeline.push( { $sort : sortObject } );

      if (doSkipLimit) {

      //Skip

      var pageNum = pageNumDefault;
      var perPage = perPageDefault;

      if (params.hasOwnProperty('page')) {
        pageNum = Number(params.page);
      }
      if (params.hasOwnProperty('perPage')) {
        perPage = params.perPage;
      }

      var skip = (pageNum * Number(perPage)) - Number(perPage);

      pipeline.push({$skip: skip})

      //limit
      pipeline.push({$limit: Number(perPage)})

    }*/ //end of skipLimit conditional

      //final lookups
      pipeline.push(
        {
          $lookup: {
            from: 'images',
            localField: 'image',
            foreignField: '_id',
            as: 'image'
          }
        }
      )
      pipeline.push(
        {
         $lookup: {
           from: 'images',
           localField: 'additionalImages',
           foreignField: '_id',
           as: 'additionalImages'
         }
       }
      )
      pipeline.push(
        {
         $lookup: {
           from: 'images',
           localField: 'thumbnail',
           foreignField: '_id',
           as: 'thumbnail'
         }
       }
      )
      pipeline.push({
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews'
        }
      })

      //after pipeline declaration

      let products = await Product.aggregate(pipeline).cursor({}).exec();


      let returnProducts = [];

      await products.eachAsync(async function(prod) {   //iterates through cursor, and final formatting

        prod.brand = prod.brand[0];
        prod.image = prod.image[0];
        prod.thumbnail = prod.thumbnail[0];
        if (prod.specs.msrpCurrency != "USD" && prod.specs.msrpCurrency != "") {
          const oldMsrp = prod.specs.msrp;
          const conversionRate = await currencyRates.getPairsRate(prod.specs.msrpCurrency, "USD");
          prod['specs']['msrp'] = oldMsrp * conversionRate;
        }
        let productDeals = [];
        let productDealsPromises = prod.deals.map(async function(deal) {
          return new Promise(async function(resolve, reject) {
            if (deal.currency != "USD" && deal.currency != "") {
              const conversionRate = await currencyRates.getPairsRate(prod.specs.msrpCurrency, "USD");
              deal.convertedPrice = deal.salesPrice * conversionRate;
              deal.convertedCurrency = "USD";
            } else {
              deal.convertedPrice = deal.salesPrice;
              deal.convertedCurrency = "USD";
            }
            productDeals.push(deal);
            resolve();
          })
        })
        await Promise.all(productDealsPromises);
        prod.deals = productDeals;
        //custom filtering / transforming that requires custom functions

      //add field best price
      /*
      pipeline.push(
        {
          $addFields: {
            bestPrice: {
              $min: { $concatArrays: ["$deals.salesPrice", ["$specs.msrp"]] }
            }
          }
        }
      )
      */

      if (prod.deals && prod.deals.length > 0) prod.bestPrice = prod.deals[0].convertedPrice;
      else prod.bestPrice = prod.specs.msrp;

      prod.deals.forEach(function(deal) {
        if (deal.convertedPrice < prod.bestPrice) prod.bestPrice = deal.convertedPrice;
      })
      if (prod.specs.msrp < prod.bestPrice) prod.bestPrice = prod.specs.msrp;

      //console.log(prod.bestPrice);
      //add discount field
      /*$addFields: {
        discount: {
          $subtract: [
            "$specs.msrp", "$bestPrice"
          ]
        },
*/

        prod.discount = prod.specs.msrp - prod.bestPrice;

        returnProducts.push(prod)
      })

      //match price

      var priceParamArray = [];

      let filteredProducts = [];

      if (params.hasOwnProperty('price') && !_.includes(paramsSkipArray, 'price')) {

        priceParamArray = params.price.split(',');

        let priceMatch = {};

        let priceMatchConditions = [];
         priceParamArray.forEach(function(minMaxPair) {
          minMaxPair = minMaxPair.split('-');
          let matchObject = {};
          if (minMaxPair.length > 1) {
            //matchObject['bestPrice'] = { $gte : Number(minMaxPair[0]), $lt : Number(minMaxPair[1]) }
            returnProducts.forEach(function(prod) {
              if (prod.bestPrice >= Number(minMaxPair[0]) && prod.bestPrice <= Number(minMaxPair[1])) {
                filteredProducts.push(prod);
              }
            })
          } else {
            //matchObject['bestPrice'] = { $gte : Number(minMaxPair[0]) }
            returnProducts.forEach(function(prod) {
              if (prod.bestPrice >= Number(minMaxPair[0])) {
                filteredProducts.push(prod);
              }
            })
          }
          //priceMatchConditions.push(matchObject)
        })
        //priceMatch = { $or : priceMatchConditions  }
        /*
        pipeline.push({
          $match :  priceMatch
        })
        */
      } else {
        filteredProducts = returnProducts;
      }

      //Sort

      let sortKey = sortByDefault; //default

      var sortParam = params.sortBy;

      if (params.sortBy == 'popularity') sortKey = 'popularity';
      if (params.sortBy == 'price') sortKey = 'bestPrice';
      if (params.sortBy == 'rating') sortKey = 'ratings.compositeScore';
      if (params.sortBy == 'discount') sortKey = 'discount';
      if (params.sortBy == 'speed') sortKey = 'specs.speed';
      if (params.sortBy == 'range') sortKey = 'specs.range';



      var sortDir = params.sortDir;
      var sortDirParam = sortDirDefault;
      if (sortDir == 'asc') sortDirParam = 1;

      //custom added
      filteredProducts = filteredProducts.sort(function(a, b) {
        if (sortDirParam == 1) {
          return dottie.get(a, sortKey) - dottie.get(b, sortKey);
        } else {
          return dottie.get(b, sortKey) - dottie.get(a, sortKey);
        }
      })
      /*
      let sortObject = {};

      sortObject[sortKey] = Number(sortDirParam);

      pipeline.push( { $sort : sortObject } );
      */
      if (doSkipLimit) {

      //Skip

      var pageNum = pageNumDefault;
      var perPage = perPageDefault;

      if (params.hasOwnProperty('page')) {
        pageNum = Number(params.page);
      }
      if (params.hasOwnProperty('perPage')) {
        perPage = params.perPage;
      }

      var skip = (pageNum * Number(perPage)) - Number(perPage);

      //added
      var sliceEnd = skip + Number(perPage);

      filteredProducts = filteredProducts.slice(skip, sliceEnd);

      //end added
      /*

      pipeline.push({$skip: skip})

      //limit
      pipeline.push({$limit: Number(perPage)})
      */
    }

      resolve(filteredProducts);

  })
}
