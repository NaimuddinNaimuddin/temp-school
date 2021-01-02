const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let messageModel = new schema({
  message:{
      type:String
  }

}, { timestamps: true })
messageModel.plugin(mongoosePaginate);
messageModel.plugin(mongooseAggregatePaginate);

var message = mongoose.model('message', messageModel);
module.exports = message