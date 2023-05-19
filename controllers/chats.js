let bodyParser = require("body-parser");
let Chat = require('../models/chats');
const fs = require('fs');
const Sighting = require("../models/sightings"); //file system


exports.create = function (chatData) {
    console.log('***************** in funct *****************88')

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
// exports.list_all = function(req,res,sightingObj) {
//     console.log(sightingObj)
//     let sightingId = req.params.sightingId
//     let username = req.query.username
//     let ret = [];
//     Chat.find({sightingId:sightingId},(err,chats) => {
//         if (err)
//             console.log(err)
//         else {
//             const bird_data = fs.readFileSync('public/birds.csv', 'utf-8')
//             const bird_list = bird_data.split('\n').sort()
//             res.render('sighting',{title:'View A sighting',data:sightingObj, chats:chats, username:username, species: bird_list,});
//         }
//
//     })
//     return ret;
// };