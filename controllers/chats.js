let bodyParser = require("body-parser");
let Chat = require('../models/chats');


exports.create = function (chatData) {


    let chat = new Chat({
        sightingId: chatData.sightingId,
        username: chatData.username,
        message: chatData.message,
        created_at: chatData.created_at
    });
    //chat.sightingId.push(chatData.sightingId);

    chat.save(function (err, results) {
        if (err) {
            console.log(err)
        } else {
            console.log('Chat has been successfully saved !')
        }
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

// load the data for a specific sighting
// exports.getSightingById = function (req,res,next) {
//     Sighting.findById(req.params.sightingId, function(err,obj){
//         if (err)
//             console.log(err)
//         else
//             res.render('sighting.ejs',{title:'View A sighting',data:obj});
//     });
// };