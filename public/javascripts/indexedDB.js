/**
 * Helper function to connect to IndexDB
 * @param {*} handleSuccess 
 * @returns requestIDB
 */
function connectToIDB(handleSuccess){

    const handleUpgrade = (ev) => {
        const db = ev.target.result
        console.log("Upgrading")
        db.createObjectStore("usernames", {keyPath: "id",autoIncrement: true})
        db.createObjectStore("locations", {keyPath: "id",autoIncrement: true})
        db.createObjectStore("sightings", {keyPath: "id",autoIncrement: true})
        db.createObjectStore("chats", {keyPath: "id", autoIncrement: true})
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

/**
 * Helper function to read value from IndexDB
 * only for location and username
 */
function readValue(objectStoreName, requestIDB, readValueSuccess, readValueError){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)

    let savedValue = myStore.get(1)
    savedValue.addEventListener("success", readValueSuccess)
    savedValue.addEventListener("error", readValueError)
}

function readAllValues(objectStoreName, requestIDB, readValueSuccess){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)

    let allValues = myStore.getAll()
    allValues.addEventListener("success", readValueSuccess)
    allValues.addEventListener("error", (err) =>{
        console.log(`Failed to read all values in ${objectStoreName}: ${err}`)
    })
}

function clearStore(objectStoreName, requestIDB){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)
    myStore.clear()
}

/**
 * Helper function to write values from IndexDB
 * @param objectStoreName - name of object store new value being placed in
 * @param requestIDB  - Idb instance
 * @param value - the new value being added
 */
function saveValue(objectStoreName, requestIDB, value){
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction([objectStoreName], "readwrite")
    const myStore = transaction.objectStore(objectStoreName)

    if (objectStoreName === "locations" || objectStoreName === "usernames")
        myStore.clear() //clear past data if exists
    myStore.add({data: value})
    console.log(`value: ${value} was saved in the ${objectStoreName} store in IDb`)

}
//export to be available in other JS scripts
export { connectToIDB,readValue,readAllValues,saveValue,clearStore};

