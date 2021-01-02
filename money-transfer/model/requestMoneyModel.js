const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let requestMoneyModel = new schema({
   name:{
       type:String
   },
   agentId:{
       type:String
   },
   requestedTime:{
    type:String,
      default: Date.now()
   },
   status:{
       type:String,
       enum:["requested","approved"],
       default:"requested"
   },
     transferType:{
     type:String,
     enum:["Send","Withdraw","Receive"]
   },
   agentMobileNumber:{
     type:String
   },
   amount:{
       type:Number
   },
   amountType:{
       type:String,
       enum:["USD","CDF"]
   },
   adminMobileNumber:{
    type:String
   },
   transactionType:{
       type:String,
       enum:["Send","Withdraw"]
   }  


}, { timestamps: true })
requestMoneyModel.plugin(mongoosePaginate);
requestMoneyModel.plugin(mongooseAggregatePaginate);

      
module.exports= mongoose.model('requestMoney',requestMoneyModel);

