let name = null;
let roomNo = null;
let socket = io();


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init(sightingData, username) {
    console.log(`Sighting data is: ${sightingData.username}`);
    // scroll to the bottom of the chat div
    let chatDiv = document.getElementById("history");
    chatDiv.scrollTop = chatDiv.scrollHeight;
    //set all the values
    // will change value when username stored in cookie/indexDB
    name = username;
    console.log(`User name: ${name}`);
    // roomNo will be the id of the sighting
    roomNo = sightingData._id;
    console.log(`Room num: ${roomNo}`);
    // Then connect to the room
    connectToRoom();
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            //hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory(userId,' has joined the room ', true);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory(who, chatText,false);
    });
    /// Called when someone leaves the room
    socket.on('left', function (room, userId) {
        writeOnHistory(userId,'has left the room',true);
    });

}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let userId = name;
    let chatText = document.getElementById('chat_input').value;
    console.log(`room number is: ${roomNo}`)
    socket.emit('chat',userId,roomNo,chatText);
    let who = 'Me:'
    writeOnHistory(who, chatText,false);
}


/**
 * used to connect to a room. It gets
 * - the user name and room number from the interface using document.getElementById('').value
 * - uses socket.emit('create or join') to join the room
 */
function connectToRoom() {
    let userId = name;
    socket.emit('create or join',roomNo,userId);
    //hideLoginInterface(roomNo, userId);
}

/**
 * it appends the given html text to the history div
 * @param userId: the userId of the person sending the message
 * @param text: the text to append
 * @param isChatRoomNotif: boolean showing ifthe text is a message or a chatroom notification
 * chatroom notification lets users know if a user has joined or left the room
 *
 */
function writeOnHistory(userId,text,isChatRoomNotif) {
    let chatTable = document.getElementById('chat_history');
    // formatting date
    let datetime = new Date();
    let date = datetime.toLocaleDateString();
    let time = datetime.toLocaleTimeString('default', {hour:"numeric",minute:"numeric"});
    // inserting row as last element in table
    let chatRow = chatTable.insertRow(-1);

    if (!isChatRoomNotif){
        // creating three cells to insert into table
        let username = chatRow.insertCell(0).innerText = userId ;
        let message = chatRow.insertCell(1).innerText = text;
        let created = chatRow.insertCell(2).innerText = `${date} ${time}` ;
    } else {
        // Creating cells with the chatroom notification and date showing
        let notif = chatRow.insertCell(0);
        let created = chatRow.insertCell(1);
        created.innerText = `${date} ${time}` ;
        created.setAttribute("style","color:red;");
        notif.innerText = `${userId} ${text}` ;
        //let notification take up 2 cells
        notif.colSpan = 2;
        notif.setAttribute("style","color:red;");
    }

    //scroll to the bottom o div when new chat added
    let chatDiv = document.getElementById("history");
    chatDiv.scrollTop = chatDiv.scrollHeight;
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

