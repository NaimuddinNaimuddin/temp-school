const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

module.exports = {
     verifyToken : (req,res,next)=>{
         var token = req.headers.authorization 
         console.log(token)
      if(!token){  res.send({ responseCode :403 , responseMessage : 'Please provide the token.'}) }
      
      else { ///////////
              jwt.verify(token , 'secretkey' , (err,authData)=>{
                           if(err) { res.send({ responseCode :403 , responseMessage : 'token decode error'})}
                           else{//////////////
                              console.log(authData)
                        userModel.findOne( { _id : authData._id } ,(err , result)=>{
                                if( err) {  res.send( { responseCode : 500 , responseMessage : 'usermodel find error'})}
                                else if(!result){  res.send( { responseCode : 404 , responseMessage : 'User not found'}) }
                        else{/////////////  

                            if( result.status == "BLOCK" ){  res.send( { responseCode : 404 , responseMessage : 'User blocked'})  }
                     else   if( result.status == "DELETE" ){  res.send( { responseCode : 404 , responseMessage : 'User deleted'})  }
                     else{
                            req.user = result
                           next()

                            }
                        }/////////////////

                        })/////findone

                           }////////////////////
               })  ///

        }//////////////////
     },////////verify token
     verifyToken1 : (req,res,next)=>{
      var token = req.headers.authorization 
      console.log(token)
   if(!token){  res.send({ responseCode :403 , responseMessage : 'Please provide the token.'}) }
    next()
  },////////verify token
     
} //////////module exports/////////// 