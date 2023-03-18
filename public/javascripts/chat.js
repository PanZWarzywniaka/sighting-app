let name = null;
let roomNo = null;
let socket = io();


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    //set all the values
    // will change value when username stored in cookie/indexDB
    name = document.getElementById('name').innerHTML;
    console.log(`User name: ${name}`);
    // will be the id of the chat
    roomNo = document.getElementById('roomNumber').innerHTML;
    console.log(`Room num: ${roomNo}`);
    // Then conncect to the room
    connectToRoom();
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            //hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined the room ');
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        name = document.getElementById('name').innerHTML;
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
    /// Called when someone leaves the room
    socket.on('left', function (room, userId) {
        writeOnHistory('<b>' + userId + ':</b> ' + ' has left the room');
    });

}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let userId = document.getElementById('name').innerHTML;
    let chatText = document.getElementById('chat_input').value;
    console.log(`room number is: ${roomNo}`)
    socket.emit('chat',userId,roomNo,chatText);
    let who = 'Me:'
    writeOnHistory('<b>' + who + '</b> ' + chatText);
}


/**
 * used to connect to a room. It gets
 * - the user name and room number from the interface using document.getElementById('').value
 * - uses socket.emit('create or join') to join the room
 */
function connectToRoom() {
    let userId = document.getElementById('name').innerHTML;
    socket.emit('create or join',roomNo,userId);
    //hideLoginInterface(roomNo, userId);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
// function hideLoginInterface(room, userId) {
//     document.getElementById('initial_form').style.display = 'none';
//     document.getElementById('chat_interface').style.display = 'block';
//     document.getElementById('who_you_are').innerHTML= userId;
//     document.getElementById('in_room').innerHTML= ' '+room;
// }

