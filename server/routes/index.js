var router = require('express').Router();

//this is where the routes go
router.use('/api', require('./api'));

if (process.env.NODE_ENV !== 'production') {
  router.use('/admin', require('./admin'));
}

module.exports = router;
