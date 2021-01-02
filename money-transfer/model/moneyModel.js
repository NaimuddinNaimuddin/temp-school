const mongoose = require('mongoose');
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');
let money = new schema({
    userType:{
        type:String,
        enum:["CLIENT","AGENT"]
    },
    noOfTransaction: {
        type: String
    },
    withdrowalMoreThan:{
        type:String
    },
    withdrowalLessThan:{
        type:String
    },
    sendMoreThan:{
        type:String
    },
    sendLessThan:{
        type:String
    },
    depositMoreThan:{
        type:String    
    },
    depositLessThan:{
        type:String
    }
},{timestamps:true})

money.plugin(mongoosePaginate);
money.plugin(mongooseAggregatePaginate);

module.exports =mongoose.model('money', money)
