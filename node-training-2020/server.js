const express = require('express')
const bodyParser = require('body-parser')

const userModel = require('./models/userModel')
const commonFunctions = require('./common/commonFunctions')
const cors = require('cors')


const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(cors())

const mongooseConn = require('./config/mongooseConn')


app.post('/user/login' ,  (req,res)=>{

    if(!req.body.email) { res.send({  responseCode : 400 , responseMessage : 'Email required'})}
    else if  (!req.body.password){  res.send({ responseCode : 400 ,   responseMessage : 'Password required'})}
    else {  
             // res.json({ responseCode :200})
 
             userModel.findOne({ $and : [ {email : req.body.email},{status : { $in :["ACTIVE"]}}] },(err,result)=>{
               if(err){ res.send({ responseCode :500 , responseMessage : 'Internal server error'})}
               else if (!result) { res.send({ responseCode : 404 , responseMessage : 'Email Not Registered'})  }
               else {///////////////
 
              if(result.emailVerified == false) { res.send ({ responseCode : 400 , responseMessage :'Please verify the email link'})}
             else if ( result.otpVerified == false) { res.send ({ responseCode : 400 , responseMessage : 'please verify the otp'})}
             else if ( !commonFunctions.verifyPassword(req.body.password , result.password)) 
             { res.send({ responseCode :400 , responseMessage : 'Password is wrong'}) }
             else
             { /////////////////////
               
             let token  = commonFunctions.genJwt( {_id :result._id} , 'secretkey' , {expiresIn : '50000s'})
 
              res.status(200).json ({ responseCode :200 , responseMessage: 'Login success', token : token })
 
 
             }/////////////////
           
           
           }///////////////
             })
    }
 
   } )





app.listen(port)

module.exports = app