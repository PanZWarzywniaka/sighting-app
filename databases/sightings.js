let mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect
//let url = 'mongodb://localhost:27017/test';
let mongoDB = 'mongodb://127.0.0.1:27017/sightings';

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB);
let db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//  MORE GENERAL WAY WOULD BE TO CALL:
// try {
//     let connection = mongoose.createConnection(mongoDB);
//     console.log("connection to mongodb worked!");
// }catch (e) {
// console.log('error in db connection: ' +e.message)
// }
//
// WHICH WOULD ALLOW MULTIPLE CONNECTIONS


