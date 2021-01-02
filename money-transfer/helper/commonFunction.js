const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const FCM = require('fcm-node');
const async = require('async')
//const multiparty = require('multiparty');
var twilio = require('twilio');
const fs = require('fs');
const QRCode = require('qrcode')



const accountSid = 'AC596ef7dbd338dc52c4c1e41bd0fc477d';
const authToken = '5dcb0753a292c6d907ba7f17d7e8f80d';
const client = require('twilio')(accountSid, authToken);
cloudinary.config({
    cloud_name: 'dl2d0v5hy',
    api_key: '841684319665911',
    api_secret: 'kG5j1sXJT3eeNAp5CtpZgIdfQzM'
});
module.exports = {

    sendSMS(mobileNumber,otp,callback) {
        //var x= Math.floor(1000 + Math.random() * 9000);
        client.messages.create({
            body:otp,
            to: mobileNumber,  // Text this number
            from: '+13367906768' // From a valid Twilio number
        }, (smsErr, smsResult) => {
            console.log("i am here 35 >>>>", smsErr, smsResult)
            if (smsErr) {
                callback(smsErr, null);
            }
            else {
                callback(null, smsResult);
            }
        })
    },


    sendTextOnMobileNumber(mobileNumber,text,callback) {
        //var x= Math.floor(1000 + Math.random() * 9000);
        client.messages.create({
            body:text,
            to: mobileNumber,  // Text this number
            from: '+13367906768' // From a valid Twilio number
        }, (smsErr, smsResult) => {
            console.log("i am here 35 >>>>", smsErr, smsResult)
            if (smsErr) {
                callback(smsErr, null);
            }
            else {
                callback(null, smsResult);
            }
        })
    },



    emailSend:(email,text,callback) => {

        let html=`<html lang="en"><head>

                      <meta charset="utf-8">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <meta name="description" content="">
                      <meta name="author" content="">
                    
                      <title></title>
                  
                     
                  
                  </head>
                  <body style="margin: 0px; padding: 0px;">
                    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                  
                          <table style="width:600px;margin:0px auto;background:#09A2E0;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
                              <tbody>
                          <tr>
                            <td style='font-size: 16px;text-align:center;' >
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
                              <tbody>
                              <tr style="background-color:#98D7F0; text-align:left;">
                                <td style="font-size:16px;text-align:left;">  
                                  <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
                                    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1581486831/oa05fqzebkvgyofvvu3g.jpg" style="padding: 0px;margin: 0px; width="100" height="100"">
                                  </span>
                                </td>                                   
                              </tr>               
                            </tbody>
                              </table>
                              
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
                                <tbody>
                                  <tr>
                                           <td  style="text-align: center;     padding: 16px 0px;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;">WELCOME TO MONEY TRANSFER</div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center; padding: 10px 0px;">
                                                        <div style="color:#fff;font-size:20px;margin-bottom:5px;font-weight: 200;">${text}</div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;    padding: 20px 0px;">
                                                        
                                    </td> 
                                      </tr>                 
                                </tbody>
                              </table>
                  
                            </table>
                          </div>
                      
                    </body>
                    </html>`

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                "user": global.gConfig.nodemailer.user,
                "pass": global.gConfig.nodemailer.pass

            }
        });
        var mailOptions = {
            from: "<do_not_reply@gmail.com>",
            to: email,
            subject: 'Money Transfer Enterprises',
            text: text,
            html: html,
            link:"https://www.youtube.com/watch?v=4O50JzS9IbM"
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                callback(error, null)
            } else {
                callback(null, info.response)
            }
        });

    },

    uploadImage(img, callback) {
        cloudinary.v2.uploader.upload(img, (err, result) => {
            if(err){
                console.log("common error=>",err)
                callback(err, null)
            }
            else{
                callback(null, result.secure_url)
            }
        });
    },

    videoUpload(base64, callback) {
        cloudinary.v2.uploader.upload(base64,
            {
                resource_type: "video",
            },
            function (error, result) {
                if (error) {
                    console.log(">>>", error)
                    callback(error, null)
                }
                else {
                    console.log("Video url", result.secure_url)
                    callback(null, result.secure_url)
                }
            });
    },

    qrcodeGenrate: (code, callback) => {

      QRCode.toDataURL(code,function (err, url) {
      if (err) {
      callback(err, null)
      }
      else {
      callback(null, url)
      }
      })
      },
    sendLink: (email, firstName, _id, callback) => {

        let html=`<html lang="en"><head>

                      <meta charset="utf-8">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <meta name="description" content="">
                      <meta name="author" content="">
                    
                      <title></title>
                  
                     
                  
                  </head>
                  <body style="margin: 0px; padding: 0px;">
                    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                  
                          <table style="width:600px;margin:0px auto;background:#faa547;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
                              <tbody>
                          <tr>
                            <td style='font-size: 16px;text-align:center;' >
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
                              <tbody>
                              <tr style="background-color:#fefbd8; text-align:left;">
                                <td style="font-size:16px;text-align:left;">  
                                  <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
                                    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1573825430/n2wi27jrk9asiym9kpux.png" style="padding: 0px;margin: 0px; width="100" height="100"">
                                  </span>
                                </td>                                   
                              </tr>               
                            </tbody>
                              </table>
                              
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
                                <tbody>
                                  <tr>
                                           <td  style="text-align: center;     padding: 16px 0px;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;">WELCOME TO THINGS TO GO</div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center; padding: 10px 0px;">
                                                        <div style="color:#fff;font-size:20px;margin-bottom:5px;font-weight: 200;"> Dear ${firstName}<p>Please click on the link for reset password.<a href = '${global.gConfig.url}resetPassword/${_id}'><button> Click here </button></a></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;    padding: 20px 0px;">
                                                        
                                    </td> 
                                      </tr>                 
                                </tbody>
                              </table>
                  
                            </table>
                          </div>
                      
                    </body>
                    </html>`

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                "user": global.gConfig.nodemailer.user,
                "pass": global.gConfig.nodemailer.pass

            }
        });
        var mailOptions = {
            from: "<do_not_reply@gmail.com>",
            to: email,
            subject: 'Sending Email using Node.js',
            //text: text,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                callback(error, null)
            } else {
                callback(null, info.response)
            }
        });

    },

    AdminSendLink: (email, firstName, _id, callback) => {

        let html=`<html lang="en"><head>

                      <meta charset="utf-8">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <meta name="description" content="">
                      <meta name="author" content="">
                    
                      <title></title>
                  
                     
                  
                  </head>
                  <body style="margin: 0px; padding: 0px;">
                    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                  
                          <table style="width:600px;margin:0px auto;background:#faa547;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
                              <tbody>
                          <tr>
                            <td style='font-size: 16px;text-align:center;' >
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
                              <tbody>
                              <tr style="background-color:#fefbd8; text-align:left;">
                                <td style="font-size:16px;text-align:left;">  
                                  <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
                                    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1573825430/n2wi27jrk9asiym9kpux.png" style="padding: 0px;margin: 0px; width="100" height="100"">
                                  </span>
                                </td>                                   
                              </tr>               
                            </tbody>
                              </table>
                              
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
                                <tbody>
                                  <tr>
                                           <td  style="text-align: center;     padding: 16px 0px;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;">WELCOME TO THINGS TO GO</div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center; padding: 10px 0px;">
                                                        <div style="color:#fff;font-size:20px;margin-bottom:5px;font-weight: 200;"> Dear ${firstName}<p>Please click on the link for reset password.<a href = '${global.gConfig.adminURL}resetPassword/${_id}'><button> Click here </button></a></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;    padding: 20px 0px;">
                                                        
                                    </td> 
                                      </tr>                 
                                </tbody>
                              </table>
                  
                            </table>
                          </div>
                      
                    </body>
                    </html>`

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                "user": global.gConfig.nodemailer.user,
                "pass": global.gConfig.nodemailer.pass

            }
        });
        var mailOptions = {
            from: "<do_not_reply@gmail.com>",
            to: email,
            subject: 'Sending Email using Node.js',
            //text: text,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                callback(error, null)
            } else {
                callback(null, info.response)
            }
        });

    },

    sendMail(email, subject, name, otp, callback) {
        let html = `<html lang="en">
                          <head>
                            <meta charset="utf-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta name="description" content="">
                            <meta name="author" content="">
                            <title>OneTalkX</title>
                          </head>
                          <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">
                         
                            <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                          <div>
                              <table style="width: 100%; border: 1px solid #ccc;" cellpadding="0" cellspacing="0">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#f1f1f1">
                                    <img height="80" width="100" src="https://res.cloudinary.com/dx6awtizi/image/upload/v1549979574/blockchainappblue.png" alt="Email register" class="">
                                </td>
                            </tr>
                                    <tr>
                                      <td style="padding: 50px 15px 10px;">Dear ${name}, </td>
                                    </tr>
                                    <tr>
                                    <td style="padding: 10px 15px 10px;"></td>
                                  </tr>
                                  
                                    <tr>
                                    <td><p>Your forgot password OTP:  ${otp}</a></p></td>
                                    </tr>
                                   
                                           
                                    <tr>
                                      <td style="padding: 25px 15px 20px;">
                                        Thanks &amp; Regards <br> Team OneTalk
                                        </td>
                                   </tr>
                                   <tr>
                                 </tr>
                                </tbody>
                              </table>
                              </div>
                            </div>
                          </body>
                         </html>`
        const mailBody = {
            from: "<do_not_reply@gmail.com>",
            to: email,
            subject: subject,
            html: html
        };
        nodemailer.createTransport({
            service: 'GMAIL',
            auth: {
                "user": global.gConfig.nodemailer.user,
                "pass": global.gConfig.nodemailer.pass
            },
            port: 587,
            host: 'smtp.gmail.com'

        }).sendMail(mailBody, callback)
    },



    getOTP() {
        var otp = Math.floor(1000 + Math.random() * 9000);
        return otp;
    },

    jwtDecode: (token, callback) => {
        jwt.verify(token, 'moneyTransfer', (err, decoded) => {

            if (err) {
                callback(err, null)
            } else {
                console.log(" i am here verify", decoded.id)
                callback(null, decoded.id)

            }
        })
    },

    pushNotification(deviceTokens, message, title, body, callback) {
        var serverKey = 'AAAAelLhCWQ:APA91bHaGIpHilsBDRz5e7UwfBOiTFwnQIioCKoE9pH2Q_jeZRGiE6YO89qt2Snhb49mM8qjd4BBvr097sTLS9XoRv7mcs_1owJhJp8_MkjRhWYE4mSgnNJyEQaN9KG8hrMh71cZObfk';
        var fcm = new FCM(serverKey);

        var message = {
            to: deviceTokens,
            notification: {
                title: title,
                body: body
            }
        };
        console.log("device token is =========>>>>>", deviceTokens)
        fcm.send(message, function (err, response) {
            console.log("message is =====>>>", message)
            if (err) {
                callback(err, null)
            }
            else {
                console.log("Push notification detail>>", response, deviceTokens);
                callback(null, deviceTokens)
            }
        });
    },

    multipleEmailSend: (fromUser, data, cb) => {
        let html = `<html lang="en">
                          <head>
                            <meta charset="utf-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta name="description" content="">
                            <meta name="author" content="">
                            <title>Vendor & Users</title>
                          </head>
                          <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">
                         
                            <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                          <div>
                              <table style="width: 100%; border: 1px solid #ccc;" cellpadding="0" cellspacing="0">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#f1f1f1">
                                    <img height="80" width="100" src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1570788694/asmx9uzpy2iimrjc69vh.jpg" alt="Email register" class="">
                                </td>
                            </tr>
                                    <tr>
                                      <td style="padding: 50px 15px 10px;">Dear Customer </td>
                                    </tr>
                                    <tr>
                                    <td style="padding: 10px 15px 10px;"></td>
                                  </tr>
                                  
                                    <tr>
                                    <td><p>this is template</a></p></td>
                                    </tr>
                                   
                                           
                                    <tr>
                                      <td style="padding: 25px 15px 20px;">
                                        Thanks &amp; Regards <br> Team OneTalkx
                                        </td>
                                   </tr>
                                   <tr>
                                 </tr>
                                </tbody>
                              </table>
                              </div>
                            </div>
                          </body>
                         </html>`
        const mailBody = {
            from: '<do_not_reply@gmail.com>',
            to: fromUser,
            subject: data,
            context: fromUser,
            html: html
        };
        nodemailer.createTransport({
            service: 'GMAIL',
            auth: {
                "user": global.gConfig.nodemailer.user,
                "pass": global.gConfig.nodemailer.pass
            },
            port: 587,
            host: 'smtp.gmail.com'
        }).sendMail(mailBody, cb)

    },

    parameterRequired(body) {

        const a = Object.keys(body)
        let i;

        for (i = 0; i < a.length; i++) {
            console.log("BODY", body[a[i]])
            if (body[a[i]] == undefined) {
                console.log("this key is missing", a[i])
                return a[i];
            }
        }



    },

    multipleImageUploadCloudinary: (imageB64, callback) => {
        let imageArr = []
        async.eachSeries(imageB64, (items, callbackNextiteration) => {
            module.exports.uploadImage(items, (err, url) => {
                if (err)
                    console.log("error is in line 119", err)
                else {
                    imageArr.push(url);
                    callbackNextiteration();
                }
            })
        }, (err) => {
            console.log("hhhhhhhhhhhhhhhhhhhhhhhhh", imageArr)

            callback(null, imageArr);

        }

        )
    },




}