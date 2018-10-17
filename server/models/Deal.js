var mongoose = require('mongoose');
var slug = require('slug');
var uniqueValidator = require('mongoose-unique-validator');

var Store = mongoose.model('Store');
var Product = mongoose.model('Product');

var DealSchema = new mongoose.Schema({
  store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  url: String,
  originalPrice: Number,   //in currency of store
  salesPrice: Number, //in currency of store
  currency: String,
  lastChecked: Date,
  availability: Boolean
})

mongoose.model('Deal', DealSchema);

var Deal = mongoose.model('Deal');

DealSchema.post('save', async function(doc, next) {
  Product.findOne({_id: doc.product}).lean().exec().then(async function(product) {
    if (!product.hasOwnProperty('deals') || product.deals == null || product.deals == undefined) product.deals = [];
    product.deals.push(doc._id);

    Product.findOneAndUpdate({ slug: product.slug}, {$set : { deals: product.deals }}, {new : true}).then(function(error, result) {
      console.log(error);
      console.log(result);
      next();
    })

  })
})

DealSchema.pre('remove', async function(doc, next) {
  console.log("HERE");
  console.log('doc',doc);
  //remove deal from associated product

})
