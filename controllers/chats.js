let bodyParser = require("body-parser");
let Chat = require('../models/chats');
const fs = require('fs');
const Sighting = require("../models/sightings"); //file system

/**
 * Creates a new chat object and stores in MongoDB
 * that draw the image will incrementally paint on the screen. 
 *
 * @param  chatData  a chat data to be stored in server DB
*/
exports.create = function (chatData) {

    let chat = new Chat({
        sightingId: chatData.sightingId,
        username: chatData.username,
        message: chatData.message,
        created_at: chatData.created_at
    });

    chat.save(function (err, results) {
        if (err)
            console.log(err)
    });
};

/**
 * Final controller for viewing a sighting, lists all chats from MongoDB
 * and renders the sighting page
 * @param req
 * @param res
 * @param sightingObj
 */
exports.list_all = function (req, res,sightingObj) {
    let sightingId = req.params.sightingId
    let username = req.query.username
    Chat.find({sightingId:sightingId}).sort({ created_at: 1 })
        .exec(function (err, chats) {
            if (err) {
                console.log(err)
            }
            else{
                const bird_data = fs.readFileSync('public/birds.csv', 'utf-8')
                const bird_list = bird_data.split('\n').sort()
                res.render('sighting',{title:'View A sighting',data:sightingObj, chats:chats, username:username, species: bird_list,});
            }
        })
};

