var mongoose = require('mongoose')
var slug = require('slug');
var uniqueValidator = require('mongoose-unique-validator');

var StoreSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},  //auto-generated
  name: { type: String, unique: true },
  logo: String,  //url
  homeUrl: String,
  isManufacturer: Boolean,
  shipsTo: [String]  // 2 or 3 digit country code
})

StoreSchema.plugin(uniqueValidator, { message: 'Slug or product not unique' });

StoreSchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

StoreSchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  } else if (this.slug != slug(this.name)) {
    this.slugify();
  }
  next();
});

mongoose.model('Store', StoreSchema);
