let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");


let sighting = require('../controllers/sightings');



/* GET home page. */
router.get('/', function(req, res, next) {
  sighting.list_all(req,res);
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'My Form' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Sighting to the DB' });
});

router.post('/add', function(req, res) {
  sighting.create(req,res);
});



//router.post('/index', character.getAge);

module.exports = router;
