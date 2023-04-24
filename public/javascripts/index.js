let username = null


$(window).on('load', function() {

    console.log("Page has been loaded!")
    readUsername()
});

const readUsernameSuccess = (ev) => {
    username = ev.target.result.text
    console.log("Saved username: ", username)
    document.getElementById('username_display').innerText = `Hello ${username}`
    document.getElementById('sightings_username').value = username //for add page

}


const handleSuccess = () => {
    console.log("Success")
    let save_btn = document.getElementById("saveUsername")
    save_btn.addEventListener("click", saveUsername)
}

const handleUpgrade = (ev) => {
    const db = ev.target.result
    console.log("Upgrading")
    db.createObjectStore("usernames", {keyPath: "id"})
}

const handleError = (err) => {
    console.error("Error: " + JSON.stringify(err)+"\n")
}


const requestIDB = indexedDB.open("db")
requestIDB.addEventListener("upgradeneeded", handleUpgrade)
requestIDB.addEventListener("success", handleSuccess)
requestIDB.addEventListener("error", handleError)

let saveUsername = () => {
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction(['usernames'], "readwrite")
    const myStore = transaction.objectStore('usernames')

    let username = document.getElementById('username_input').value

    
    myStore.clear() //clear past data if exists
    myStore.add({id: 1, text: username})

    
    console.log("Username saved")
    readUsername()
}

let readUsername = () => {
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction(['usernames'], "readwrite")
    const myStore = transaction.objectStore('usernames')

    let savedUsername = myStore.get(1) 
    savedUsername.addEventListener("success", readUsernameSuccess)

    savedUsername.addEventListener("error", (ev) => {
        console.error("There is no username in the database")
        $('#username-modal').modal('show'); //show modal
    })
}

document.querySelector('#nearby').addEventListener('click', () => {
    document.querySelector('#recent').classList.remove('active');
    document.querySelector('#nearby').classList.add('active');

  })

function colorswitch() {
    document.getElementById("demo").innerHTML = "Hello World";
    document.getElementById("recent").innerHTML = element;
    element.style.backgroundColor = "pink";
}

