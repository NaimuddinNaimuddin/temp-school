const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userType : { type : String  , enum : ["USER", "ADMIN" , "BUSINESS"] , default : "USER"},
    status : { type : String , enum : ["ACTIVE","BLOCK" ,"DELETE"] , default : "ACTIVE" },
    otpVerified : { type : Boolean , default : false},
    emailVerified : { type : Boolean , default : false},
    otp : { type : String},

    name : { type : String},
    email : { type : String},
    password : { type : String},
    posts : [],
    followers : [],
    following : [],
} , { timestamps : true})


mongoose.model('user',userSchema).findOne({userType : "ADMIN"},(error,result)=>{
    const admin = {
        userType : "ADMIN",
        otpVerified : true,
        emailVerified : true,
        name : 'naimu',
        email : 'naimuddin5409',
        password : 'naimu@123'
    }
    
    if(error){
       res.json({
           error : error ,
          message : "error in finding  admin data",
       })
    }
    else if(result){
        console.log(" Admin found")
    }
    else{
        mongoose.model('user' ,userSchema).create(admin)
        console.log('Admin created')
    }
    })

module.exports = mongoose.model('user' , userSchema )