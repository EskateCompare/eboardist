var router = require('express').Router();
var mongoose = require('mongoose');
var Feedback = mongoose.model('Feedback');


router.post('/', async function(req, res, next) {

  let feedback = new Feedback();

  feedback.email = req.body.feedback.email;
  feedback.content = req.body.feedback.content;

  feedback.save().then(function(feedback) {
    return res.json(feedback)
  }).catch(next);
})

module.exports = router;
