const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let commissionModel = new schema({

    userType: {
        type: String,
        enum: ["CLIENT", "AGENT"]
    },
    transactionFee: {
        type: Number
    },
    monthlyFee: {
        type: Number
    },
    annuallyFee: {
        type: Number
    },
    depositFee: {
        type: Number
    },
    withdrawalFee: {
        type: Number
    },
    commisionFee: {
        type: Number
    }
}, { timestamps: true })
commissionModel.plugin(mongoosePaginate);
commissionModel.plugin(mongooseAggregatePaginate);

var commission = mongoose.model('commission', commissionModel);
module.exports = commission