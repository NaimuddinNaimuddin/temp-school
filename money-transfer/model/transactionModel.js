const mongoose = require('mongoose');
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');
let transactionModel = new schema({
    userId:{
    type:schema.Types.ObjectId,
    ref:"user"
    },
    agentId:{
        type:String,
        ref:"user"
    },
    mobileNumber: {
        type: String
    },
    name:{
      type:String
    },
    amount:{
      type:Number   
    },
    amountUSD:{
        type:Number 
    },
    amountCDF:{
        type:Number 
    },
    amountType:{
        type:String,
        enum:["USD","CDF"]
    },
    transactionType:{
        type:String,
        enum:["Send","Withdraw"]
    },  
    transferTo:{
        type:String
    },      
    status:{
        type:String,
        enum:["PENDING","COMPLETED"],
        default:"PENDING"
    },
    commission:{
        type:Number
    }


},{timestamps:true})

transactionModel.plugin(mongoosePaginate);
transactionModel.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model('transaction', transactionModel);
//module.exports = securityQuestion