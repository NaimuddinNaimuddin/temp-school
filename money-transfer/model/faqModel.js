const mongoose = require('mongoose');
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');

let faqModel = new schema({
    faqId:{
        type:schema.Types.ObjectId,
        ref:"staticContent"
    },
    question:{
        type:String
    },
    answer: {
        type: String
    },
  
    status:{
        type:String,
        enum:["ACTIVE","BLOCK","DELETE"],
        default:"ACTIVE"
    }
},{timestamps:true})
faqModel.plugin(mongoosePaginate);
faqModel.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model('faq', faqModel);
//module.exports = securityQuestion