const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
},(err)=>{ 
    if(err){ console.log('error in mongoose connection') }
    else{ console.log('connected to mydb using mongoose')}
});