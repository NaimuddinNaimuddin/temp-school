const mongoose = require('mongoose');
const schema = mongoose.Schema;

let questionModel = new schema({
    question: {
        type: String
    },
    answer:{
        type:String
    }
},{timestamps:true})
var securityQuestion = mongoose.model('questions', questionModel);
module.exports = securityQuestion