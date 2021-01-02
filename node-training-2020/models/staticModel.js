const mongoose =require('mongoose');

const staticSchema = new mongoose.Schema({
    termsAndConditions : {  type : String },
    privacyPolicy :{ type:String  },
    aboutUs: {  type: String  },
})
 
mongoose.model('static' , staticSchema  )
.findOne({aboutUs : 'this is something about us'}, (err,result)=>{   
    if(err){ res.json({ error : err }) }
    else if (result){
       console.log('static page found')
    } else{
        const staticObj = {
            termsAndConditions : 'this is the terms and conditions of us', 
            privacyPolicy : 'this is the privacy policy of us',
            aboutUs : 'this is something about us' 
        }

        mongoose.model('static' , staticSchema).create(staticObj)
        console.log('static page created')
    }
})


module.exports =  mongoose.model('static',staticSchema);