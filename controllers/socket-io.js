chat = require("./chats");

/**
 * initializes socket io
 * @param io
 */
exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            /**
             * create or joins a room
             */
            socket.on('create or join', function(room, userId) {
                socket.to(room).emit('joined',room, userId);
                socket.join(room);
            });


            /**
             * send chat messages
             */
            socket.on('chat',function(userId,roomNo,chatText){
                socket.to(roomNo).emit('chat',roomNo, userId, chatText);
                // create chat object
                let today = new Date();
                let chatData = {
                    "username": userId,
                    "sightingId": roomNo,
                    "message": chatText,
                    "created_at": today.toString()
                }
                chat.create(chatData);
            });

            /**
             * disconnect
             */
            socket.on('disconnect',function(reason){
                console.log('User has disconnected')
            });

        } catch (e) {
        }
    });
}