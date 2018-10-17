var mongoose = require('mongoose');
var slug = require('slug');

var Product = mongoose.model('Product');


var ReviewSchema = new mongoose.Schema({
  name: String,
  date: Date,
  rating: { type: Number, required : true },   //out of 5
  content: String,
  product:  {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  source: { type: String, enum: ['internal', 'amazon'] }
})

mongoose.model('Review', ReviewSchema);

var Review = mongoose.model('Review');

ReviewSchema.post('save', async function(doc, next) {
  Product.findOne({ _id: doc.product }).lean().exec().then(async function(product) {

    if (!product.hasOwnProperty('reviews') || product.reviews == null || product.reviews == undefined) product.reviews = [];
    product.reviews.push(doc._id);  //add review to associated product

    //update ratings
    let externalSum = 0;
    let externalAmount = 0;
    let externalAverage = 0;
    let internalSum = 0;
    let internalAmount = 0;
    let internalAverage = 0;

    let compositeScore = 0;


    let fetchedReviews = [];

    let reviewFetchPromises = product.reviews.map(function(reviewId) {
      return new Promise(function(resolve, reject) {
        Review.findOne({ _id : reviewId }).lean().exec().then(function(review) {
          fetchedReviews.push(review);
          resolve();
        })
      })
    })
    await Promise.all(reviewFetchPromises);

    fetchedReviews.forEach(function(review) {
      if (review.source == 'internal') {
        internalSum += review.rating;
        internalAmount += 1;
      } else {
        externalSum += review.rating;
        externalAmount += 1;
      }
    })
    if (internalAmount > 0) internalAverage = internalSum  / internalAmount;
    else if (externalAmount > 0) externalAverage = externalSum / externalAmount;

    if ((internalAmount + externalAmount) > 0) {
      compositeScore = ((externalSum + internalSum) / (externalAmount + internalAmount)) * 20
      }

      //update product
      if (!product.hasOwnProperty('ratings') || product.ratings == null || product.ratings == undefined) product.ratings = {
        external : {
          average : 0,
          amount : 0
        },
        internal : {
          average : 0,
          amount : 0
        },
        compositeScore : 0
      };


      product['ratings']['external']['average'] = externalAverage;
      product['ratings']['external']['amount'] = externalAmount;

      product['ratings']['internal']['average'] = internalAverage;
      product['ratings']['internal']['amount'] = internalAmount;


      product['ratings']['compositeScore'] = compositeScore;

      console.log(compositeScore);

      Product.findOneAndUpdate({ slug: product.slug}, {$set : {reviews: product.reviews, ratings: product.ratings}}, {new : true}).then(function(error, result) {
        console.log(error);
        console.log(result);
        next();
      })


  })
})

function weightedMean(arrValues, arrWeights) {

  var result = arrValues.map(function (value, i) {

    var weight = arrWeights[i];
    var sum = value * weight;

    return [sum, weight];
  }).reduce(function (p, c) {

    return [p[0] + c[0], p[1] + c[1]];
  }, [0, 0]);

  return result[0] / result[1];
}
