const mongoose = require('mongoose');
global.Promise = mongoose.Promise;

const config = require('../config/config.js');
const db_name = `${global.gConfig.database}`;
const host = 'localhost:27017';
const DB_URL = `mongodb://${host}/${db_name}`

mongoose.connection.openUri(DB_URL,{ useNewUrlParser: true ,useUnifiedTopology:true} );
/******************************** Events of mongoose connection. ******************************************************/
// CONNECTION EVENTS
// When successfully connected

mongoose.connection.on('connected',  ()=> {  
 console.log('success','Mongoose default connection open to ' + DB_URL);

});                
// If the connection throws an error
mongoose.connection.on('error', (err) =>{  
  console.log('error','Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected',  ()=> {  
  console.log('warning','Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () =>{  
  mongoose.connection.close( ()=> { 
    console.log('warning','Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});