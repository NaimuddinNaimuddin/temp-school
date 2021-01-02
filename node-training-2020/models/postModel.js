const mongoose =require('mongoose');

const postSchema = new mongoose.Schema({
    title : {  type : String },
    body :{ type:String  },
    url: {  type: String  },
    createdBy : { type : String},
})

module.exports =  mongoose.model('post',postSchema);
