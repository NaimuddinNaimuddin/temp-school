const mongoose = require('mongoose');
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var mongoosePaginate = require('mongoose-paginate');

var exchangeModel = new schema({
    
    buy:{
        type: Number
    },
    sell: {
        type: Number
    },
  
    
},{timestamps:true})
exchangeModel.plugin(mongoosePaginate);
exchangeModel.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model('exchange', exchangeModel);
//module.exports = securityQuestion