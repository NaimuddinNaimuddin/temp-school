const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
// const static = require('../models/staticModel')
const commonFunctions =require('../common/commonFunctions')
const { check, validationResult } = require('express-validator')


// const bcrypt = require('bcryptjs')

module.exports ={
   signup : (req,res)=>{
            
      // const errors = validationResult(req)
      // if (!errors.isEmpty()) {
      //   return res.status(422).json({ errors: errors.array() });
      // }


                if(!req.body.name){ res.send ({ responseCode : 400  , responseMessage : 'Name required'}) }
  else  if(!req.body.email){ res.send ({ responseCode : 400  , responseMessage : 'Email required'}) }
  else  if(!req.body.password){ res.send ({ responseCode : 400  , responseMessage : 'Password required'})}
  else { // else1

    userModel.findOne({ $and :[ {"email" : req.body.email} ,{status : { $in : ["ACTIVE","BLOCK"]}}]},(err,result)=>{
      if(err) { res.send ({ responseCode :500, responseMessage : 'Internal Server Error'})}
      else if(result) {  res.send({responseCode : 404 , responseMessage : 'Email already exists'}) }
      else {  //else2
        
        
        commonFunctions.genHash(req.body.password ,10 , (hashErr,hash)=>{
          if (hashErr){ res.send({ responseCode : 500 , responseMessage : 'Error in hash'})}
          else { //else 3
            
            req.body.password = hash
            req.body.otp = commonFunctions.genOtp()

            
            commonFunctions.sendMails( req.body.email , req.body.name ,'Subject-VERIFY OTP and LINK' , req.body.otp, (mailErr , mailSent)=>{
              if( mailErr) { res.send ( { responseCode : 500 , responseMessage : 'Mail Sent Failed'})}
              else { //else4
                
                
                new  userModel(req.body).save((saveErr , saveResult)=>{
                  if(saveErr) {res.send({  responseCode : 500 , responseMessage : 'Internal server error' , saveErr : saveErr})}
                  else{ res.send({ responseCode : 200 , responseMessage : 'Signup successfully' , saveResult : saveResult })}
                })
                
                // res.send({ responseCode :200 , responseMessage: 'mail send okk'})
                
              } // else 4
            } )
            
          }// else 3
        })
        
      } //else 2
      
    })
    
    // if(err) { res.send ({ responseCode :500, responseMessage : 'Internal Server Error'})}

   } //else 1

   }, //Sign up
   verifyOtp : (req,res)=>{

    if(!req.body.email) { res.json({ responseCode : 400 ,responseMessage : 'Email required'})}
    else if  (!req.body.otp){  res.json({ responseCode :400, responseMessage : 'Otp required'})}
    else {  
      //******************//
      userModel.findOne({ $and : [ {"email" : req.body.email},{status : { $in :["ACTIVE"]}}]} ,(err,result)=>{
        if(err) { res.send ({ responseCode :500, responseMessage : 'Internal Server Error'})}
        else if( !result) {  res.send({responseCode : 404 , responseMessage : 'Email not found'}) }
        else{//////////////
  
          if(req.body.otp != result.otp){   res.send ({  responseCode : 400 , responseMessage : ' Otp is wrong' })}
          else{/////////////
            if ( result.otpVerified == true ){ res.send({ responseCode : 404 , responseMessage : 'Your Otp is already verified'})}
            else{ //////////
    
              userModel.findByIdAndUpdate({_id :result._id} , { $set : { otpVerified: true }} ,(upErr , upResult)=>{ 
                if(upErr) {   res.send({ responseCode : 500 , responseMessage: 'Error in verifying otp'}) }
                else { ///////
                             res.send ({ responseCode : 200 , responseMessage : 'Otp verified successfully'})
                }///////////
             })
              
              
            }

          }///////////////
        
  
        
        }///////////////
      })
      
   //****************//
   }  
         
   }, //Verify otp 
   verifyLink : (req,res)=>{

    userModel.findOne({ $and : [ {"email" : req.params.email},{status : { $in :["ACTIVE"]}}]} ,(err,result)=>{
      if(err) { res.send ({ responseCode :500, responseMessage : 'Internal Server Error'})}
      else if( !result) {  res.send({responseCode : 404 , responseMessage : 'Email not found'}) }
      else{//////////////


        if ( result.emailVerified == true ){ res.send({ responseCode : 404 , responseMessage : 'Your Email is already verified'})}
        else{ //////////

          userModel.findByIdAndUpdate({_id :result._id} , { $set : { emailVerified: true }} ,(upErr , upResult)=>{ 
            if(upErr) {   res.send({ responseCode : 500 , responseMessage: 'Error in verifying link'}) }
            else { ///////
                         res.send ({ responseCode : 200 , responseMessage : 'Email verified successfully'})
            }///////////
         })
          
          // res.send({ responseCode :200 })
        }

      
      }///////////////
    })

   
         
   }, //Verify link
  login : (req,res)=>{

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

             res.send ({ responseCode :200 , responseMessage: 'Login success', token : token })


            }/////////////////
          
          
          }///////////////
            })
   }

  }, //Login 



  profile1 : (req,res)=>{


    userModel.findOne({ $and : [ {_id : req.params.userId},{status : { $in :["ACTIVE"]}}] })
    .select({"password" : false , "__v" : false , "otp" : false ,})
    .exec( (err,result)=>{
      if(err)     { res.send({ responseCode :500 , responseMessage : 'Internal server error'})}
 else if (!result) { res.send({ responseCode : 404 , responseMessage : 'Data Not found in db'})  }
 else {///////////////

  if (result.otpVerified ==false || result.emailVerified == false)
  { res.send ( { responseCode : 400 , responseMessage : 'Please verify email link and otp'})}
  else {

    res.send({ responseCode : 200 , responseMessage : result })
  }
  
}////////
})


  },//profile

  profile : (req , res)=>{
           userModel.find({} ,(err,result)=>{
      if(err)     { res.send({ responseCode :500 , responseMessage : 'Internal server error'})}
        else {
          res.send( { responseCode : 200 , responseResult : result})
        }
           })
  },

  resendOtp : ( req,res)=>{


  if(!req.body.email){ res.send ({ responseCode : 400 , responseMessage : 'Email required'})}
  else{ //////////////
   
    userModel.findOne({ $and : [ {"email" : req.body.email},{status : { $in :["ACTIVE"]}}]} ,(err,result)=>{
      if(err) { res.send ({ responseCode :500, responseMessage : 'Internal Server Error'})}
      else if( !result) {  res.send({responseCode : 404 , responseMessage : 'Email not found'}) }
      else{////////////// 

          let newOtp =  commonFunctions.genOtp()

    commonFunctions.sendMails(result.email , result.name , 'SUBJECT - RESEND OTP ' , newOtp , (mailErr , mailSent)=>{
             if(mailErr){ res.send({ responseCode : 500 , responseMessage : 'Mail sent failed'})}
             else {

    userModel.findByIdAndUpdate({_id : result._id} , { $set : { otp : newOtp }} , ( upErr , upResult)=>{
        if(upErr) {  res.send( { responseCode : 500 , responseMessage : 'Error in updating otp'})}
        else {/////////////
                res.send({ responseCode :200 , responseMessage : 'Otp is sent to your registered mail'})
              }/////////////
        })               
             }
           } )
      }////////
    })

  } //////////////////

  }, //resend otp

  changePassword : (req, res)=>{
    
    if(!req.body.email) { res.send({  responseCode : 400 , responseMessage : 'Email required'})}
    else if  (!req.body.password){  res.send({ responseCode : 400 ,   responseMessage : 'Password required'})}
    else if  (!req.body.newPassword){  res.send({ responseCode : 400 ,   responseMessage : ' New Password required'})}
    
    else {  
             // res.json({ responseCode :200})
 
             userModel.findOne({ $and : [ {email : req.body.email},{status : { $in :["ACTIVE"]}}] },(err,result)=>{
               if(err){ res.send({ responseCode :500 , responseMessage : 'Internal server error'})}
               else if (!result) { res.send({ responseCode : 404 , responseMessage : 'Email Not Registered'})  }
               else {///////////////
                  
              if(result.emailVerified == false) { res.send ({ responseCode : 400 , responseMessage :'Please verify the email link'})}
             else if ( result.otpVerified == false) { res.send ({ responseCode : 400 , responseMessage : 'Please verify the otp'})}
             else if ( !commonFunctions.verifyPassword(req.body.password , result.password)) 
             { res.send({ responseCode :400 , responseMessage : 'Password is wrong'}) }
             else
             { /////////////////////
               
               commonFunctions.genHash( req.body.newPassword , 10 , (hashErr ,hashResult)=>{
               if(hashErr){ res.send({ responseCode : 500 , responseMessage : 'Error in hash'})}
               else {  /////////
             
                userModel.findByIdAndUpdate({_id : result._id} ,{$set : { password : hashResult }} ,(upErr , upResult)=>{
                  if( upErr){ res.send ( { responseCode : 500 , responseMessage : 'Error in updating new password'})}
                  else { ///////////////
     
                    res.send ({ responseCode :200 , responseMessage: 'Password update success'  , upResult : upResult._id})
                  }   ///////////////////
                  })
              
                }///////////
               })

             }/////////////////           
           }///////////////
             })
    }
  }, /////forget password

  upload : (req,res)=>{
     let file =  req.file.image
     console.log(file)
        // res.send('hi')
  },//
  posts : (req,res)=>{
         
    req.body.createdBy = req.user._id
        

          new postModel(req.body).save((err ,result)=>{
   if(err){
   return  res.send({ responseCode :500 , responseMessage : 'Internal server error' })
   } else {
    return  res.send({ responseCode:200, result : result})
   }
          })
  },
  postsList : (req,res)=>{
     postModel.find({},(err,result)=>{
      if(err){
        return  res.send({ responseCode :500 , responseMessage : 'Internal server error' })
        } else {
         return  res.send({ responseCode:200, result : result})
        }   
     })
  },
}//////////////////end of module exports ////////////////////////  