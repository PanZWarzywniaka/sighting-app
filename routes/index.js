let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");

//sighting controller 
let sighting = require('../controllers/sightings');

//Multer storage config
let multer = require('multer');

var storage = multer.diskStorage({ 

    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        // Make the file name the date + the file extension
        filename = Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
    });

var upload = multer({ storage: storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  sighting.list_all(req,res);
});


router.get('/sightings', function(req, res, next) {
  sighting.list_all(req,res);
});

router.get('/nearby', function(req, res, next) {
    sighting.list_nearby(req,res,next);
});


router.get('/sightings/:sightingId',function(req,res,next){
  sighting.getSightingById(req,res,next);
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Sighting to the DB' });
});

router.post('/add', upload.single('myImg'), function(req, res) {
  sighting.create(req,res);
});

module.exports = router;
