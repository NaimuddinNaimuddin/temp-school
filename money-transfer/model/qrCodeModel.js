const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let qrModel = new schema({
    name: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    emailId:{
       type:String
    },
    userId: {
        type: String
    },
    qr:{
        type:String
    },
    status:{
        type:String,
        enum:["ACTIVE","BLOCK","DELETE"],
        default:"ACTIVE"
    }
}, { timestamps: true })


qrModel.plugin(mongoosePaginate);
qrModel.plugin(mongooseAggregatePaginate);

var qr = mongoose.model('qr', qrModel);
module.exports = qr   