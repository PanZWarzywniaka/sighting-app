var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");


var character = require('../controllers/characters');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Form' });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'My Form' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Character to the DB' });
});

router.post('/add', function(req, res) {
  character.create(req,res);
});



//router.post('/index', character.getAge);

module.exports = router;
