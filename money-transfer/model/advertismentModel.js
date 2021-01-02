const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');


let advModel = new schema({
   advImage: [{
      image: {
         type:String
      },
      status: {
         type: String,
         enum: ["ACTIVE", "BLOCK", "DELETE"],
         default: "ACTIVE"
      }
   }],

}, { timestamps: true })
advModel.plugin(mongoosePaginate);
advModel.plugin(mongooseAggregatePaginate);

var adv = mongoose.model('advertisment', advModel);
module.exports = adv