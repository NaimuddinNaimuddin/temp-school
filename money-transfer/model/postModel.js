const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let postModel= new schema({
   
   name:{
       type:String
   },
   mobileNumber:{
       type:Number
   },
   Post:{
       type:String
   },
   statusImage:{
       type:String,
       default:"https://res.cloudinary.com/dl2d0v5hy/image/upload/v1579943077/nkae9wr9tdip11licxeo.png"
   },
   postImage:{
       type:String,
       default:"https://res.cloudinary.com/dl2d0v5hy/image/upload/v1579943077/nkae9wr9tdip11licxeo.png"
   },
   statusDate:{
    type: Number,
    default: Date.now()
   },
   postedDate:{
    type: Number,
    default: Date.now()
   },
   statusTime:{
    type: Number,
    default: Date.now()
   },
   postedTime:{
    type: Number,
    default: Date.now()
   },
   status:{
       type:String,
       enum:["ACTIVE","BLOCK","DELETE"],
       default:"ACTIVE"
   }

   },{ timestamps: true })
   postModel.plugin(mongoosePaginate);
   postModel.plugin(mongooseAggregatePaginate);

var post = mongoose.model('post', postModel);
module.exports = post