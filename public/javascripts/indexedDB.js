function connectToIDB(handleSuccess){

    const handleUpgrade = (ev) => {
        const db = ev.target.result
        console.log("Upgrading")
        db.createObjectStore("usernames", {keyPath: "id"})
        db.createObjectStore("locations", {keyPath: "id"})
        db.createObjectStore("sightings", {keyPath: "id"})
        db.createObjectStore("chats", {keyPath: "id"})
    }

    const handleError = (err) => {
        console.error("Error: " + JSON.stringify(err)+"\n")
    }

    const requestIDB = indexedDB.open("db")
    requestIDB.addEventListener("upgradeneeded", handleUpgrade)
    requestIDB.addEventListener("success", handleSuccess)
    requestIDB.addEventListener("error", handleError)

    return requestIDB;
}

// only for location and username
function readValue(objectStoreName, requestIDB, readValueSuccess, readValueError){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)

    let savedValue = myStore.get(1)
    savedValue.addEventListener("success", readValueSuccess)
    savedValue.addEventListener("error", readValueError)
}

// only for location and username
function saveValue(objectStoreName, requestIDB, value){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)


    myStore.clear() //clear past data if exists
    myStore.add({id: 1, data: value})
    console.log(`value: ${value} was saved in the ${objectStoreName} store in IDb`)

}

export { connectToIDB,readValue, saveValue };