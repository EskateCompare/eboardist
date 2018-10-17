var router = require('express').Router();

router.use('/products', require('./products'));
router.use('/recommend', require('./recommend'));
router.use('/filter-options', require('./filter-options'))
router.use('/text-search', require('./text-search'))
router.use('/impressions', require('./impressions'))
router.use('/feedback', require('./feedback'))

router.use(function(err, req, res, next) {  //4 args = error handler
  if (err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }
});

module.exports = router;
