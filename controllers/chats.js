let bodyParser = require("body-parser");
let Chat = require('../models/chats');


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

exports.list_all = function(req,res,sightingObj,sightingId) {
    let ret = [];
    Chat.find({sightingId:sightingId},(err,chats) => {
        if (err)
            console.log(err)
        else
            res.render('sighting',{title:'View A sighting',data:sightingObj, chats:chats});
    })
    return ret;
};