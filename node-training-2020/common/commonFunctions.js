const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
module.exports = {
    sendMails : (email,name ,sub ,otp ,cb)=>{

    var   vhtml = `http://localhost:3000/user/verifyLink/${email}`

        nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'node-trainee@mobiloitte.com',
              pass: 'Mobiloitte1'
            }
          }).sendMail({
                        from: 'node-trainee@mobiloitte.com',
                        to: email,
                        subject: sub,
                        html: `Dear ${name} , 
                        Thanks for Signup with us.
                        Your OTP is : ${otp} .
                        Click this link to verify email : ${vhtml} `,
                       
                      },  (error, info)=>{
                                            if (error) {  cb(error,null)  }
                                            else {  cb(null,info)   }
                      
                      })
    }, // send mail

    verifyPassword : (dbPass,reqPass)=>{
             return bcrypt.compareSync(dbPass,reqPass)
    } , //verify password  
    
    genJwt : (id,key,exp)=>{
    
            return jwt.sign(id,key,exp);
    } , // gen json web token  
    genOtp : ()=>{
            return  Math.floor( 1000 + Math.random() * 9999 )
   }, //  gen otp

   genHash : ( password,rounds,cb )=>{
       bcrypt.hash( password,rounds, (err,hash)=> {
       if(err){ return cb(err ,null)} 
       else { return cb(null ,hash)}

     })
   }, //gen hash

    }
 