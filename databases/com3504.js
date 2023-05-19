let mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect
//let url = 'mongodb://localhost:27017/test';
let mongoDB = 'mongodb://127.0.0.1:27017/com3504';

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB);
let db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
