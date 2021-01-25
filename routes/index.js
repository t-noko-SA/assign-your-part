var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'パート決めアプリ' });
});

router.post('/', function(req, res, next) {
  res.render('form1');
});

module.exports = router;
