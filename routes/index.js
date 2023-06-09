let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");
const fs = require('fs'); //file system

//sighting controller 
let sighting = require('../controllers/sightings');
let chat = require('../controllers/chats')

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
    sighting.list_recent(req,res,next);
});
router.get('/offline', function(req, res, next) {
    res.render('offline', { title: 'OFFLINE' });
});
/**
 * for each chat from Idb, create and save the chat
 */
router.post('/sync-chat', function(req, res, next) {
    for(let i = 0; i < req.body.length; i++){
        let chat_obj = req.body[i]
        chat.create(chat_obj.data)
    }
    res.status(200).json({ message: 'Chats synced successfully.', store:'chats' });
});

/**
 * for each sighting from Idb, create and save the sighting
 */
router.post('/sync-sighting', function(req, res, next) {
    for(let i = 0; i < req.body.length; i++){
        let sighting_obj = req.body[i]
        sighting.createFromSync(sighting_obj.data)
    }
    return res.status(200).json({ message: 'Sightings synced successfully.' , store:'sightings'});
});


router.get('/nearby', function(req, res, next) {
    sighting.list_nearby(req,res,next);
});


router.get('/mine', function(req, res, next) {
  sighting.list_mine(req,res,next);
});

router.get('/sightings/:sightingId',function(req,res,next){
  sighting.getSightingById(req,res,next);
});

//by updating identification
router.post('/sightings/:sightingId',function(req,res){
  sighting.updateSightingById(req,res);
});


router.get('/add', function(req, res, next) {
 
  //read list of all bird species so user can choose from drop down list
  const bird_data = fs.readFileSync('public/birds.csv', 'utf-8')
  const bird_list = bird_data.split('\n').sort()
  console.log(bird_list)

  res.render('add', { 
    title: 'Add a Sighting',
    species: bird_list,
 });
});

router.post('/add', upload.single('myImg'), function(req, res) {
  sighting.create(req,res);
});

module.exports = router;
