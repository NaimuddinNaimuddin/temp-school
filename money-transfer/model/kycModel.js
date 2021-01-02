const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let kycModel = new schema({
    VoterID_Name: {
        type: String
    },
    VoterID_Number: {
        type: String
    },
    name: {
        type: String
    },

    emailId: {
        type: String
    },
    uploadDate: {
        type: Number,
        default: Date.now()
    },
    updateDate: {
        type: Number,
        default: Date.now()
    },
    userId: {
        type: String
    },

    kycStatus:{
        type:String,
        enum:["approved","request"]
      },
    approvedDate: {
        type: String
    },     
    kycStatus: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DELETE"],
        default: "ACTIVE"
    },

}, { timestamps: true })
kycModel.plugin(mongoosePaginate);
kycModel.plugin(mongooseAggregatePaginate);

var kyc = mongoose.model('kyc', kycModel);
module.exports = kyc   