let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init(sightingData, username) {
    // scroll to the bottom of the chat div
    let chatDiv = document.getElementById("history");
    chatDiv.scrollTop = chatDiv.scrollHeight;
    //set all the values
    // will change value when username stored in cookie/indexDB
    name = username;
    // roomNo will be the id of the sighting
    roomNo = sightingData._id;
    // Then connect to the room
    connectToRoom();
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
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
 * and sends the message via socket
 */
function sendChatText() {
    let userId = name;
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat',userId,roomNo,chatText);
    let who = 'Me';
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
    let chatHistory = document.getElementById('chat_history');
    if (!isChatRoomNotif) {
        let datetime = new Date();
        let date = datetime.toLocaleDateString();
        let time = datetime.toLocaleTimeString('default', {hour: "numeric", minute: "numeric"});
        let username = (userId === "Me") ? name : userId;

        let isCurrentUser = userId === "Me";
        let chat = document.createElement('div');

        let img = document.createElement("img");
        img.setAttribute("alt", "Avatar");
        let src = `https://ui-avatars.com/api/?rounded=true&background=random&name=${username}`;
        img.setAttribute("src", src);

        let strong = document.createElement("strong");
        strong.append(document.createTextNode(userId));

        let msg = document.createElement("p");
        msg.append(document.createTextNode(text));

        let spanDate = document.createElement("span");
        spanDate.append(document.createTextNode(date));

        let spanTime = document.createElement("span");
        spanTime.append(document.createTextNode(time));

        if (isCurrentUser) {
            chat.setAttribute('class', 'chatContainer lighter');
            img.setAttribute("class", "right");
            spanDate.setAttribute("class", "time-left");
            spanTime.setAttribute("class", "time-left");
        } else {
            chat.setAttribute('class', 'chatContainer');
            img.setAttribute("class", "left");
            spanDate.setAttribute("class", "time-right");
            spanTime.setAttribute("class", "time-right");
        }

        // add the elements to the chat div
        chat.appendChild(strong);
        chat.appendChild(spanDate);
        chat.appendChild(img);
        chat.appendChild(msg);
        chat.appendChild(spanTime);

        chatHistory.appendChild(chat);


    } else {
        let announcement = document.createElement("p");
        announcement.append(document.createTextNode(userId + " " + text));
        announcement.setAttribute("style", "color:red;");
        chatHistory.appendChild(announcement);
    }
    // scroll to the bottom of div
    let chatDiv = document.getElementById("history");
    chatDiv.scrollTop = chatDiv.scrollHeight;
    document.getElementById('chat_input').value = '';
}




