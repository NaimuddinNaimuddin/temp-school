const userModel = require("../model/userModel");
const kycModel = require("../model/kycModel")
const qrCodeModel = require("../model/qrCodeModel")
const advModel = require("../model/advertismentModel")
const postModel = require('../model/postModel')
const requestMoneyModel = require("../model/requestMoneyModel")

var transactionModel = require("../model/transactionModel")

const { commonResponse: response } = require('../helper/responseHandler')
const { ErrorMessage } = require('../helper/responseMessege')
const { SuccessMessage } = require('../helper/responseMessege')

const { SuccessCode } = require('../helper/responseCode')
const { ErrorCode } = require('../helper/responseCode')
const bcrypt = require("bcrypt-nodejs");
const commonFunction = require('../helper/commonFunction')
const jwt = require('jsonwebtoken');

var stripe = require('stripe')("sk_test_t2fJWVp97shROH00gOMKufz6004YNf82sg");



module.exports = {
    /**
     * Function Name :signUp
     * Description   : signUp by customer
     *
     * @return response
     */
    signUp: (req, res) => {

        var query = { $and: [{ status: { $ne: "DELETE" } }, { $or: [{ emailId: req.body.emailId }, { mobileNumber: req.body.mobileNumber }] }] }

        userModel.findOne(query, (error, userData) => {
            console.log("userData", error, userData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (userData) {
                if (userData.emailId == req.body.emailId) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                }
                else if (userData.mobileNumber = req.body.mobileNumber) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                }

            }
            else {
                questionModel.findOne({ _id: req.body.questionId }, (error, question) => {
                    console.log("question", error, question)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!question) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        var otp = commonFunction.getOTP()
                        var phoneNumber = req.body.countryCode + req.body.mobileNumber

                        commonFunction.sendSMS(phoneNumber, `Thanks for registering. Your otp is :- ${otp}`, (error, otpSent) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                var password = bcrypt.hashSync(req.body.password)

                                var obj = {
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    middleName: req.body.middleName,
                                    password: password,
                                    mobileNumber: req.body.mobileNumber,
                                    gender: req.body.gender,
                                    questionId: question._id,
                                    answer: req.body.answer,
                                    state: req.body.state,
                                    userName: req.body.userName,
                                    emailId: req.body.emailId,
                                    countryCode: req.body.countryCode,
                                    pin: req.body.pin,
                                    otp: otp

                                }

                                new userModel(obj).save((error, finalData) => {
                                    console.log("finalData", error, finalData)
                                    if (error) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else if (!finalData) {
                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, finalData, SuccessMessage.ACCOUNT_CREATION)
                                    }
                                })
                            }
                        })

                    }
                })

            }
        })
    },

    /**
          * Function Name :forgotPassword
          * Description   : forgot password by customer and sent otp to customer mobileNumber
          *
          * @return response
          */
    forgotPassword: (req, res) => {
        try {

            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "CUSTOMER" }, (error, customerData) => {
                // console.log(">>>>>>123", req.userId)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

                }
                else if (!customerData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                }
                else {
                    var otp = commonFunction.getOTP(4)
                    var phoneNumber = customerData.countryCode + customerData.mobileNumber
                    commonFunction.sendSMS(phoneNumber, otp, (error, otpSent) => {
                        console.log("-----------------------")
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "CUSTOMER" }, { $set: { otp: otp, otpTime: Date.now() } }, { new: true }, (err, otpUpdate) => {
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                }
                                else {
                                    response(res, SuccessCode.OTP_SEND, otpUpdate, SuccessMessage.OTP_SEND)
                                }
                            })
                        }
                    })
                }
            })


        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
            * Function Name :otpSent
            * Description   : otp sent to mobile number of Customer
            *
            * @return response
          */

    otpSent: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (error, userData) => {
                console.log("mobebbebebee", userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);

                }
                else {
                    var otp = commonFunction.getOTP(4)
                    var phoneNumber = userData.countryCode + userData.mobileNumber
                    commonFunction.sendSMS(phoneNumber, otp, (error, otpSent) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber, userType: "CUSTOMER" }, { $set: { otp: otp, otpTime: Date.now() } }, { new: true }, (err, otpUpdate) => {
                                console.log("hhhhhhhhhhhhhhhhhhhhsssssssss", error, otpUpdate)
                                //  return
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                }
                                else if (!otpUpdate) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.OTP_SEND, otpUpdate, SuccessMessage.OTP_SEND)
                                }
                            })
                        }
                    })
                }
            })



        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

        }

    },

    /**
        * Function Name :verifyOtp
        * Description   : otp verify by user
        *
        * @return response
      */

    verifyOtp: (req, res) => {
        userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE" }, (err, result) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                if (result.otp == req.body.otp) {
                    var newTime = Date.now()
                    var difference = newTime - result.otpTime
                    console.log(">>>>>>", difference)
                    if (difference < 60000) {
                        userModel.findOneAndUpdate({ mobileNumber: result.mobileNumber }, { $set: { verifyOtp: true } }, { new: true }, (updateErr, updateResult) => {
                            if (updateErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.VERIFY_OTP);
                            }
                        })
                    }
                    else {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OTP_EXPIRED);

                    }

                }
                else {
                    response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_OTP);
                }
            }
        })
    },

    /**
      * Function Name :resetPassword
      * Description   : reset password by customer and sent otp to customer mobileNumber
      *
      * @return response
      */
    resetPassword: (req, res) => {
        try {

            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "CUSTOMER" }, (error, customerData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

                }
                else if (!customerData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                }
                else {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        var newPassword = bcrypt.hashSync(req.body.newPassword)
                        userModel.findOneAndUpdate({ _id: customerData._id, userType: "CUSTOMER" }, { $set: { password: newPassword } }, { new: true }, (error, updatePassword) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.success, updatePassword, SuccessMessage.PASSWORD_UPDATE)
                            }
                        })
                    }
                    else {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.WRONG_PASSWORD)
                    }
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }

    },


    /**
          * Function Name :submission of kyc details
          * Description   : saving the details of kyc deatils of customer
          *
          * @return response
          */

    kycSubmitDetails: (req, res) => {

        console.log("sfsfsffsfssfsfsfsf", req.headers)
        try {
            commonFunction.jwtDecode(req.headers.token, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }

                else {
                    userModel.findOne({ "_id": result, status: "ACTIVE", userType: "CUSTOMER" }, (error, userData) => {
                        console.log("sgsgsgsggsgs", userData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!userData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            var obj = {
                                "userId": userData._id,
                                "name": userData.firstName,
                                "mobileNumber": userData.mobileNumber,
                                "emailId": userData.emailId,
                                "uploadDate": userData.uploadDate,
                                "updateDate": userData.updateDate,
                                "VoterID_Name": req.body.VoterID_Name,
                                "VoterID_Number": req.body.VoterID_Number,
                                "approvedDate": "",
                                "kycStatus": "request"
                            }
                            console.log("==============>", obj.name)
                            new kycModel(obj).save((error, kycSave) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!kycSave) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, kycSave, SuccessMessage.DATA_SAVED)
                                }
                            })

                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }


    },

    /**
         * Function Name :show All Agent
         * Description   :show All Agent by User
         *
         * @return response
         */
    showAgentList: (req, res) => {
        try {

            var query = { status: { $ne: "DELETE" }, userType: "AGENT" };

            if (req.body.search) {
                query.$or = [{ firstName: { $regex: req.body.search, $options: 'i' } },
                { lastName: { $regex: req.body.search, $options: 'i' } }
                ]
            }
            if (req.body.state) {
                query.state = req.body.state;
            }
            var options = {
                page: req.body.pageNumber || 1,
                limit: req.body.limit || 10,

            }
            userModel.paginate(query, options, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (userData.docs == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

        }

    },
    /**
        * Function Name :show agent details
        * Description   :show perticuler agent details by User
        *
        * @return response
        */
    agentDetalis: (req, res) => {
        userModel.findOne({ _id: req.body.agentId, userType: "AGENT", status: "ACTIVE" }, (error, agentData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var obj = {
                    name: agentData.firstName,
                    mobileNum: agentData.mobileNumber,
                    Id: agentData.agentId
                }
                response(res, SuccessCode.SUCCESS, obj, SuccessMessage.DATA_FOUND);
            }
        })
    },
    /**
    * Function Name :block agent by customer
    * Description   :block agent by customer and move to block page
    *
    * @return response
    */
    blockAgent: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.agentId, userType: "AGENT", status: "ACTIVE" }, (error, agentData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!agentData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findByIdAndUpdate({ _id: agentData._id }, { agentStatusByUser: "BLOCK" }, { new: true }, (error, updateAgentData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!agentData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateAgentData, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

        }

    },

    /**
   * Function Name :block agent List by customer
   * Description   :block agent by customer and move to block page
   *
   * @return response
   */
    blockAgentList: (req, res) => {
        try {

            userModel.find({ agentStatusByUser: "BLOCK" }, (error, agentData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (agentData == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, agentData, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

        }

    },
    //================================================addCard================================================================
    addCard: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!result) {
                    res.send({ responseCode: 201, responseMessege: "User not found" })
                } else {
                    stripe.accounts.create({
                        type: 'custom',
                        email: result.email,
                        country: 'US',
                        requested_capabilities: ['card_payments', 'transfers'],
                    }, (error, stripeResult) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else {
                            let card = {
                                name: req.body.name,
                                bankName: req.body.bankName,
                                cardNumber: req.body.cardNumber,
                                expMonth: req.body.expMonth,
                                expYear: req.body.expYear,
                                cvvNumber: bcrypt.hashSync(req.body.cvvNumber),
                                stripeAccountId: stripeResult.id


                            }

                            console.log("asfsdfasdfasdfdas", card, result)

                            userModel.findOneAndUpdate({ _id: result._id }, { $push: { cardDetails: card } }, { new: true }, (err1, result1) => {
                                if (err1) {
                                    console.log("jjjjjjjjjjjjjjjjjjjjjj", err1)
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    console.log("jjjjjjjjjjjjjjjjjjjjjj", err1, result1.cardDetails)
                                    res.send({ responseCode: 200, responseMessege: "Card created successfully", result1 })
                                }
                            })
                        }

                    })

                }
            })
        }
        catch (error) {
            console.log(error)
            res.send({ responseCode: 500, responseMessege: "somthing went wrong" })
        }
    },
    //==================================================================================================
    sendMoney: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var obj = new transactionModel({
                        userId: userData._id,
                        mobileNumber: req.body.mobileNumber,
                        amount: req.body.amount,
                        amountType: req.body.amountType,

                    })
                    obj.save((error, transactionDaata) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, transactionDaata, SuccessMessage.DATA_SAVED);
                        }
                    })


                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

        }

    },

    withdrawalMoney: (req, res) => {
        try {
            userModel.findOne({ "_id": req.userId, status: "ACTIVE" }, (error, userData) => {
                console.log("hshshshs", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOne({ "agentId": req.body.agentId, status: "ACTIVE", userType: "AGENT" }, (error, agentData) => {
                        console.log("dhhhdhdddddddddddd", error, agentData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!agentData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            var obj = new transactionModel({
                                userId: userData._id,
                                agent_Id: agentData.agentId,
                                amount: req.body.amount,
                                amountType: req.body.amountType
                            })
                            obj.save((error, transactionDaata) => {
                                console.log("dhhhdhdd475dddddddddd", error, transactionDaata)
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, transactionDaata, SuccessMessage.DATA_SAVED);
                                }
                            })

                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
        }
    },

    qrScanToPay: (req, res) => {

        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, userData) => {
            console.log("userDetails", userData)
            console.log("userData==========>", userData.mobileNumber, userData.emailId, userData.firstName)

            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, error);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var obj = `${userData.emailId},${userData.mobileNumber},
                                    ${userData.status},${userData.firstName}`
            }
            commonFunction.qrcodeGenrate(obj, (error, scanData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, error);
                }
                else {
                    commonFunction.uploadImage(scanData, (error, imgData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, error);
                        }
                        else {

                            var obj1 = {
                                "userId": userData._id,
                                "name": userData.firstName,
                                "emailId": userData.emailId,
                                "qr": imgData,
                                "mobileNumber": userData.mobileNumber

                            }
                            new qrCodeModel(obj1).save((error, saveData) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!saveData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveData, SuccessMessage.DATA_SAVED)
                                }
                            })

                        }
                    })
                }

            })
        })

    },

    editsettingInformation: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    if (req.body.profilePic) {
                        commonFunction.uploadImage(req.body.profilePic, (error, imageData) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                req.body.profilePic = imageData
                                userModel.findOneAndUpdate({ _id: req.body.userId, status: "ACTIVE", userType: "CUSTOMER" }, { $set: req.body }, { new: true }, (error, userData) => {
                                    if (error) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    } else if (!userData) {
                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                                    } else {
                                        response(res, SuccessCode.SUCCESS, userData, SuccessMessage.PROFILE_DETAILS);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        var obj = {}
                        if (req.body.name) {
                            obj.name = req.body.name
                        }
                        if (req.body.staus) {
                            obj.status = req.body.status
                        }
                        userModel.findOneAndUpdate({ _id: req.body.userId, status: "ACTIVE", userType: "CUSTOMER" }, { $set: obj }, { new: true }, (error, userData) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else if (!userData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                            } else {
                                response(res, SuccessCode.SUCCESS, userData, SuccessMessage.PROFILE_DETAILS);
                            }
                        })
                    }

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
        }

    },

    postAdd: (req, res) => {
        try {
            new postModel(req.body).save((error, saveData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    response(res, SuccessCode.SUCCESS, saveData, SuccessMessage.DATA_SAVED)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
        }
    },
    logInSuperAgent: (req, res) => {
        userModel.findOne({ agentId: req.body.agentId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, result1) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result1) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        var pass = bcrypt.compareSync(req.body.password, result1.password)
                        if (pass) {
                            if (req.body.pin == req.body.confirmPin) {
                                userModel.findOneAndUpdate({ _id: result1._id, status: "ACTIVE", userType: "SUPER-AGENT" },
                                    { $set: { pin: req.body.pin } }, { new: true }, (error, pinUpdate) => {
                                        console.log("====================", error, pinUpdate)
                                        if (error) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else if (!pinUpdate) {
                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                        }
                                        else {
                                            var token = jwt.sign({ id: pinUpdate._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'moneyTransfer');
                                            var result1 = {
                                                token: token,
                                                pinUpdate
                                            }
                                            response(res, SuccessMessage.SUCCESS, result1, SuccessMessage.UPDATE_SUCCESS)
                                        }

                                    })
                            }
                            else {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.PIN_NOT_MATCHED)
                            }
                        }
                        else {
                            response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.WRONG_PASSWORD)
                        }

                    }
                })
            }
        })

    },

    addMoneySuperAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, userData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ agentId: req.body.agentId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, superData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!superData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        var check = bcrypt.compareSync(req.body.password, superData.password)
                        if (check && req.body.pin == superData.pin) {
                            var obj = {
                                amountType: req.body.amountType,
                                amount: req.body.amount,
                                name: superData.name,
                                agentId: req.body.agentId,
                                adminId: req.body.adminId
                            }
                            new requestMoneyModel(obj).save((error, sentRequest) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!sentRequest) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, sentRequest, SuccessMessage.REQUEST_SENT)
                                }
                            })
                        }
                        else {
                            response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL)
                        }

                    }
                })
            }
        })

    },




}

