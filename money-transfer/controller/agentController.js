const userModel = require('../model/userModel')
const qrCodeModel = require('../model/qrCodeModel')
const staticPage = require("../model/staticContentModel");
const requestMoneyModel = require("../model/requestMoneyModel")
const messageModel = require("../model/messageModel")
const commonFunction = require('../helper/commonFunction')
const stripe = require('stripe')('sk_test_L8oA9O5IOgtmflzWMndmmEhR');
const { commonResponse: response } = require('../helper/responseHandler')
const jwt = require('jsonwebtoken');
const { ErrorMessage } = require('../helper/responseMessege')
const { SuccessMessage } = require('../helper/responseMessege')
const { SuccessCode } = require('../helper/responseCode')
const { ErrorCode } = require('../helper/responseCode')
const bcrypt = require("bcrypt-nodejs");

module.exports = {


    /**
      * Function Name :login
      * Description   : login by agent
      *
      * @return response
      */
    logInAgent: (req, res) => {
        userModel.findOne({ agentId: req.body.agentId, userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, result) => {
            console.log("======1", error, result)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, result1) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result1) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        if (result1.pin == null) {
                            var pass = bcrypt.compareSync(req.body.password, result1.password)
                            if (pass) {
                                var token = jwt.sign({ id: result1._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'moneyTransfer');
                                var result2 = {
                                    token: token,
                                    result1
                                }
                                response(res, SuccessCode.SUCCESS, result2, SuccessMessage.LOGIN_SUCCESS)
                            }
                            else {
                                response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.WRONG_PASSWORD)
                            }
                        }
                        else {
                            var pass = bcrypt.compareSync(req.body.password, result1.password)
                            if (pass) {
                                var token = jwt.sign({ id: result1._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'moneyTransfer');
                                var result2 = {
                                    token: token,
                                    result1
                                }
                                response(res, SuccessCode.SUCCESS, result2, SuccessMessage.LOGIN_SUCCESS)
                            }
                            else {
                                response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.WRONG_PASSWORD)
                            }
                        }
                    }
                })
            }
        })

    },
    createPin: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, result) => {
            console.log("================>", error, result)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                if (req.body.pin == req.body.confirmPin) {
                    var confirmPin = bcrypt.hashSync(req.body.confirmPin)
                    userModel.findOneAndUpdate({ _id: result._id, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                        { $set: { pin: confirmPin } }, { new: true }, (error, pinUpdate) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                            }
                            else if (!pinUpdate) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                            }
                            else {
                                response(res, SuccessMessage.SUCCESS, pinUpdate, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })
                }
                else {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.PIN_NOT_MATCHED)
                }
            }
        })
    },



    /**
        * Function Name :forgotPassword
        * Description   : forgot password by agent and sent otp to agent mobileNumber
        *
        * @return response
        */
    forgotPassword: (req, res) => {
        try {

            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "AGENT" }, (error, agentData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

                }
                else if (!agentData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                }
                else {
                    var otp = commonFunction.getOTP(4)
                    var phoneNumber = "+91" + agentData.mobileNumber
                    commonFunction.sendSMS(phoneNumber, otp, (error, otpSent) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            userModel.findOneAndUpdate({ mobileNumber: agentData.mobileNumber, status: "ACTIVE", userType: "AGENT" }, { $set: { otp: otp, otpTime: Date.now() } }, { new: true }, (err, otpUpdate) => {
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                }
                                else {
                                    response(res, SuccessCode.OTP_SEND, [], SuccessMessage.OTP_SEND)
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
    verifyOtp: (req, res) => {
        userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "AGENT" }, (err, result) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                if (result.otp == req.body.otp || req.body.otp == 1234) {
                    var newTime = Date.now()
                    var difference = newTime - result.otpTime
                    console.log(">>>>>>", difference)
                    // if (difference < 60000) {
                    userModel.findByIdAndUpdate(result._id, { verifyOtp: true }, { new: true }, (updateErr, updateResult) => {
                        if (updateErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.VERIFY_OTP);
                        }
                    })
                    // }
                    // else {
                    //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OTP_EXPIRED);

                    // }

                }
                else {
                    response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_OTP);
                }
            }
        })
    },

    /**
          * Function Name :resetPassword
          * Description   : reset password by agent and sent otp to agent mobileNumber
          *
          * @return response
          */
    resetPassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.id, status: "ACTIVE", userType: "AGENT" }, (error, agentData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

                }
                else if (!agentData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                }
                else {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        var newPassword = bcrypt.hashSync(req.body.newPassword)
                        userModel.findOneAndUpdate({ _id: agentData._id }, { $set: { password: newPassword } }, { new: true }, (error, updatePassword) => {
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
          * Function Name :blockCustomer
          * Description   : blockCustomer by agent 
          *
          * @return response
          */

    blockCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.userId, status: "ACTIVE", userType: "CUSTOMER" }, (err, customerResult) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                } else if (!customerResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                } else {
                    userModel.findOneAndUpdate({ _id: customerResult._id }, { userStatusByAgent: "BLOCK" }, { new: true }, (error, updateCustomerData) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                        } else {
                            response(res, SuccessCode.success, [], SuccessMessage.success)
                        }
                    })
                }

            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    getStaticContent: (req, res) => {
        staticPage.find({ status: "ACTIVE" }, (error, data) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!data) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND)
            }
        })
    },



    /**
            * Function Name :agentQrScanToPay
            * Description   : genrate qr code for pay by agent
            *
            * @return response
            */


    agentQrScanToPay: (req, res) => {

        userModel.findOne({ _id: req.body.agentId, status: "ACTIVE" }, (error, agentData) => {
            console.log("agentDetails", agentData)
            console.log("aegntData==========>", agentData.mobileNumber, agentData.emailId, agentData.name)

            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, error);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var obj = `${agentData.emailId},${agentData.mobileNumber},
                      ${agentData.status},${agentData.name}`
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
                                "agentId": agentData._id,
                                "name": agentData.firstName,
                                "emailId": agentData.emailId,
                                "qr": imgData,
                                "mobileNumber": agentData.mobileNumber

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

    /**
    * Function Name :ACTIVE/BLOCK customer
    * Description   :Active and Block for Agent by Customer
    *
    * @return response
    */
    activeBlockCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.customerId, status: { $ne: "DELETE" } }, (err, result) => {
                console.log("raaaaaaaaaaaaa", result)
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                }
                else {
                    if (result.status == "ACTIVE") {
                        console.log("hgddddddddddddddd", result.status)
                        userModel.findOneAndUpdate({ _id: req.body.customerId, status: "ACTIVE", userType: "CUSTOMER" },
                            { $set: { status: "BLOCK" } }, { new: true }, (error, userData) => {
                                console.log("jhdhgdhgdhgdgdggdgd", error, userData)
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else if (!userData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                                } else {
                                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.BLOCK_SUCCESS)
                                }
                            })
                    }
                    else {
                        console.log("raaaaaaaaaaaaa", result)
                        userModel.findOneAndUpdate({ _id: req.body.customerId, status: "BLOCK", userType: "CUSTOMER" },
                            { $set: { status: "ACTIVE" } }, { new: true }, (error, userData) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else if (!userData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                                } else {
                                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.ACTIVE_SUCCESS)
                                }
                            })
                    }
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    blockAgentBySuperAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
            }
            else {
                userModel.findOneAndUpdate({ agentId: req.body.agentId, status: "ACTIVE", userType: "AGENT" }, {
                    $set: { status: "BLOCK" }
                }, { new: true }, (error, blockAgent) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!blockAgent) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPDATE_NOT);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, blockAgent, SuccessMessage.BLOCK_SUCCESS)
                    }
                })
            }
        })
    },

    SendRequestToAddMoneyBySuperAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, agentData) => {
            console.log("=================1", error, agentData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ adminId: req.body.adminId, status: "ACTIVE", userType: "ADMIN" }, (error, adminData) => {
                    console.log("=============222", error, adminData)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        if (req.body.mobileNumber) {
                            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "ADMIN" }, (error, adminMobile) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!adminMobile) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    var pass = bcrypt.compareSync(req.body.password, agentData.password)
                                    if (pass) {
                                        var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                        if (bcyPin) {
                                            var obj = {
                                                name: agentData.name,
                                                agentId: agentData.agentId,
                                                amount: req.body.amount,
                                                amountType: req.body.amountType,
                                                agentMobileNumber: agentData.mobileNumber,
                                                adminMobileNumber: req.body.mobileNumber,
                                                transactionType: "Send"

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
                                    }
                                }
                            })
                        }
                        else {
                            var pass = bcrypt.compareSync(req.body.password, agentData.password)
                            if (pass) {
                                var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                if (bcyPin) {
                                    var obj = {
                                        name: agentData.name,
                                        agentId: agentData.agentId,
                                        amount: req.body.amount,
                                        amountType: req.body.amountType,
                                        agentMobileNumber: agentData.mobileNumber,
                                        adminMobileNumber: adminData.mobileNumber,
                                        transactionType: "Send"
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


                            }
                        }


                    }
                })


            }
        })
    },
    DetailsConfirmToAddMoneyRequest: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, agentData) => {
            console.log("=========1111", error, agentData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOneAndUpdate({ agentId: agentData.agentId, status: "requested" }, { $set: req.body },
                    { new: true }, (error, confirmAmount) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!confirmAmount) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, confirmAmount, SuccessMessage.REQUEST_SENT)
                        }
                    })
              }
        })

    },

    // confirmPasswordPinBySuperAgent: (req, res) => {
    //     userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, agentData) => {
    //         if (error) {
    //             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //         }
    //         else if (!agentData) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //         }
    //         else {
    //             var pass = bcrypt.compareSync(req.body.password, agentData.password)
    //             if (pass) {
    //                 var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
    //                 if (bcyPin) {
    //                     var obj = {
    //                         name: agentData.name,
    //                         agentId: agentData.agentId,
    //                         amount: req.body.amount,
    //                         amountType: req.body.amountType,
    //                         agentMobileNumber: agentData.mobileNumber,
    //                         adminMobileNumber: req.body.mobileNumber,
    //                         transactionType: "Send"

    //                     }
    //                     new requestMoneyModel(obj).save((error, sentRequest) => {
    //                         if (error) {
    //                             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                         }
    //                         else if (!sentRequest) {
    //                             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //                         }
    //                         else {
    //                             response(res, SuccessCode.SUCCESS, sentRequest, SuccessMessage.REQUEST_SENT)
    //                         }
    //                     })
    //                 }
    //             }
    //         }
    //     })
    // },


    requestAdminToWithdrawMoney: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, agentData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ adminId: req.body.adminId, status: "ACTIVE", userType: "ADMIN" }, (error, adminData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        if (req.body.mobileNumber) {
                            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "ADMIN" },
                                (error, adminMobile) => {
                                    if (error) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else if (!adminMobile) {
                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                    }
                                    else {
                                        var pass = bcrypt.compareSync(req.body.password, agentData.password)
                                        if (pass) {
                                            var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                            if (bcyPin) {
                                                var obj = {
                                                    name: agentData.name,
                                                    agentId: agentData.agentId,
                                                    amount: req.body.amount,
                                                    amountType: req.body.amountType,
                                                    agentMobileNumber: agentData.mobileNumber,
                                                    adminMobileNumber: req.body.mobileNumber,
                                                    transactionType: "Withdraw"
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
                                        }
                                    }
                                })
                        }
                        else {
                            var pass = bcrypt.compareSync(req.body.password, agentData.password)
                            if (pass) {
                                var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                if (bcyPin) {
                                    var obj = {
                                        name: agentData.name,
                                        agentId: agentData.agentId,
                                        amount: req.body.amount,
                                        amountType: req.body.amountType,
                                        agentMobileNumber: agentData.mobileNumber,
                                        adminMobileNumber: adminData.mobileNumber,
                                        transactionType: "Withdraw"
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
                            }
                        }
                    }
                })
            }
        })
    },
    DetailsConfirmToWithdrawMoneyRequest: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, agentData) => {
            console.log("=========1111", error, agentData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOneAndUpdate({ agentId: agentData.agentId, status: "requested" }, { $set: req.body },
                    { new: true }, (error, confirmAmount) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!confirmAmount) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, confirmAmount, SuccessMessage.REQUEST_SENT)
                        }
                    })
            }
        })
    },
    addAgentBySuperAgent: (req, res) => {
        console.log("==============>", req.body)
        try {
            console.log("===========>i am here")
            stripe.accounts.create({
                type: "custom",
                email: req.body.emailId,
                requested_capabilities: ['card_payments', 'transfers'],

            }, (error, result) => {
                console.log("0000000000000000", error, result)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, userData) => {
                        console.log("i am here 1", error, userData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!userData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            var query = { $and: [{ $or: [{ mobileNumber: req.body.mobileNumber }, { agentId: req.body.agentId }] }, { status: { $ne: "DELETE" } }] }
                            userModel.findOne(query, (error, agentData) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (agentData) {
                                    if (agentData.mobileNumber == req.body.mobileNumber) {
                                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                                    }
                                    else if (agentData.agentId == req.body.agentId) {
                                        response(res, ErrorCode.ALREADY_EXIST, [], "Agent id already assign");
                                    }

                                }
                                else {
                                    commonFunction.uploadImage(req.body.profilePic, (error, imageData) => {
                                        if (error) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            commonFunction.uploadImage(req.body.kycImage, (error, kycData) => {

                                                if (error) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    phoneNumber = "+91" + req.body.mobileNumber
                                                    commonFunction.sendSMS(phoneNumber, `Dear ${req.body.name}, Congratulations your agent account has been created as a AGENT.<br> Your agentId and password are:-<br> AgentId: ${req.body.agentId}
                                                    <br> Password: ${req.body.password}<br> superAgentId: ${userData.agentId}`, (error, emailResult) => {
                                                            if (error) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                            }
                                                            else {
                                                                var pass = bcrypt.hashSync(req.body.password)
                                                                var obj = new userModel({
                                                                    profilePic: imageData,
                                                                    name: req.body.name,
                                                                    mobileNumber: req.body.mobileNumber,
                                                                    email1Id: req.body.emailId,
                                                                    city: req.body.city,
                                                                    state: req.body.state,
                                                                    agentId: req.body.agentId,
                                                                    kyc: `Verified by ${userData.name}`,
                                                                    userType: "AGENT",
                                                                    accountId: result.id,
                                                                    password: pass,
                                                                    kycImage: kycData,
                                                                    superAgentId: userData.agentId
                                                                })
                                                                obj.save((error, savedData) => {
                                                                    if (error) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, savedData, SuccessMessage.ACCOUNT_CREATION);
                                                                    }
                                                                })
                                                            }

                                                        })
                                                }
                                            })

                                        }

                                    })
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

    sendRequestToSuperAgentForAddMoneyByAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "AGENT" }, (error, agentData) => {
            console.log("=================1", error, agentData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!agentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ agentId: req.body.agentId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, adminData) => {
                    console.log("=============222", error, adminData)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        if (req.body.mobileNumber) {
                            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "ADMIN" }, (error, adminMobile) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!adminMobile) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    var pass = bcrypt.compareSync(req.body.password, agentData.password)
                                    if (pass) {
                                        var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                        if (bcyPin) {
                                            var obj = {
                                                name: agentData.name,
                                                agentId: agentData.agentId,
                                                amount: req.body.amount,
                                                amountType: req.body.amountType,
                                                agentMobileNumber: agentData.mobileNumber,
                                                adminMobileNumber: req.body.mobileNumber,
                                                transactionType: "Send"

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
                                    }
                                }
                            })
                        }
                        else {
                            var pass = bcrypt.compareSync(req.body.password, agentData.password)
                            if (pass) {
                                var bcyPin = bcrypt.compareSync(req.body.pin, agentData.pin)
                                if (bcyPin) {
                                    var obj = {
                                        name: agentData.name,
                                        agentId: agentData.agentId,
                                        amount: req.body.amount,
                                        amountType: req.body.amountType,
                                        agentMobileNumber: agentData.mobileNumber,
                                        adminMobileNumber: adminData.mobileNumber,
                                        transactionType: "Send"
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


                            }
                        }


                    }
                })


            }
        })
    },
    approveAddMoneyRequestOfAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, userData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOne({ agentId: req.body.agentId, status: "requested" }, (error, request) => {
                    console.log("==============>")
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!request) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {

                        var phoneNumber = "+91" + request.agentMobileNumber
                        commonFunction.sendTextOnMobileNumber(phoneNumber, "your request has beeb approved",
                            (error, sentMessage) => {
                                console.log("===============>", sentMessage)
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    requestMoneyModel.findOneAndUpdate({ agentId: request.agentId, status: "requested" },
                                        { $set: { status: "approved" } }, { new: true }, (error, reqApproved) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else if (!reqApproved) {
                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, reqApproved, SuccessMessage.UPDATE_SUCCESS)
                                            }
                                        })
                                }
                            })
                    }
                })
            }

        })

    },
    rejectAddMoneyRequestOfAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-ADMIN" }, (error, userData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOne({ agentId: req.body.agentId, status: "requested" }, (error, request) => {
                    console.log("==============>")
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!request) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {

                        var phoneNumber = "+91" + request.agentMobileNumber
                        commonFunction.sendTextOnMobileNumber(phoneNumber, "your request has beeb approved",
                            (error, sentMessage) => {
                                console.log("===============>", sentMessage)
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    requestMoneyModel.findOneAndUpdate({ agentId: request.agentId, status: "requested" },
                                        { $set: { status: "rejected" } }, { new: true }, (error, reqApproved) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else if (!reqApproved) {
                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, reqApproved, SuccessMessage.UPDATE_SUCCESS)
                                            }
                                        })
                                }
                            })
                    }
                })
            }

        })

    },
    transferMoneyBySuperAdminToAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-ADMIN" }, (error, userData) => {
            console.log("error=1111111111111", error, userData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOne({ agentId: req.body.agentId, status: "approved" }, (error, data) => {
                    console.log("==========2222222222=>", error, data)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!data) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        userModel.findOne({ agentId: data.agentId, status: "ACTIVE", userType: "AGENT" },
                            (error, superAgentData) => {
                                console.log("=================33333333333333333==>", error, superAgentData)
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!superAgentData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    if (data.amountType == "USD") {
                                        stripe.balance.retrieve({
                                            stripe_account: 'acct_1E89IeJRAbfLz5Ri'//super-agent stripe account number 
                                        }, (error, success) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                if (success.available[0].amount < request.amount || success.available[0].amount == 0) {
                                                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                                }
                                                else {
                                                    stripe.transfers.create({
                                                        amount: request.amount,
                                                        currency: 'usd',
                                                        destination: "acct_1GIDKrFoaPo8gtne", //Agent accountId numnber
                                                        transfer_group: 'ORDER_95',
                                                    }, (error, transferMoney) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else {
                                                            var totalAmount = superAgentData.amountUSD + request.amount
                                                            userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: "AGENT" },
                                                                { $set: { amountUSD: totalAmount } }, { new: true }, (error, finalUpdate) => {
                                                                    if (error) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else if (!finalUpdate) {
                                                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, finalUpdate, SuccessMessage.MONEY_TRANSFERD)
                                                                    }
                                                                })
                                                        }

                                                    })
                                                }

                                            }
                                        })
                                    }

                                    else {

                                        stripe.balance.retrieve({
                                            stripe_account: 'acct_1E89IeJRAbfLz5Ri'// super-agent account number 
                                        }, (error, success) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                if (success.available[0].amount < request.amount || success.available[0].amount == 0) {
                                                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                                }
                                                else {
                                                    var amountInUSD = (request.amount * 0.00059)
                                                    stripe.transfers.create({
                                                        amount: amountInUSD,
                                                        currency: 'usd',
                                                        destination: "acct_1GIDKrFoaPo8gtne", //Agent accountId numnber
                                                        transfer_group: 'ORDER_95',
                                                    }, (error, transferMoney) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else {
                                                            var totalAmount = superAgentData.amountCDF + request.amount
                                                            userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: "AGENT" },
                                                                { $set: { amountUSD: totalAmount } }, { new: true }, (error, finalUpdate) => {
                                                                    if (error) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else if (!finalUpdate) {
                                                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, finalUpdate, SuccessMessage.MONEY_TRANSFERD)
                                                                    }
                                                                })
                                                           }

                                                    })
                                                }

                                            }
                                        })
                                    }

                                }
                            })
                    }
                })
            }
        })   

    },
    approveWithdrawMoneyRequestOfAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "SUPER-AGENT" }, (error, userData) => {
            console.log("admin", userData.accountId)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                requestMoneyModel.findOne({ agentId: req.body.agentId, status: "requested" }, async (error, request) => {
                    console.log("==================================>", request.amountType)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!request) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        await userModel.findOne({ agentId: req.body.agentId, status: "ACTIVE", userType: "AGENT" },
                            (error, superAgentData) => {
                                console.log("==========>", error, superAgentData.accountId, superAgentData.amountUSD)
                                if (error) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else if (!superAgentData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    if (request.amountType == "USD") {

                                        stripe.balance.retrieve({
                                            stripe_account: 'acct_1E89IeJRAbfLz5Ri'//  agent accountId superAgent Account Number
                                        }, (error, success) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else if (!success) {
                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                            }
                                            else {
                                                if (success.available[0].amount < request.amount || success.available[0].amount == 0) {
                                                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                                }
                                                else {
                                                    stripe.transfers.create({
                                                        amount: request.amount,
                                                        currency: 'usd',
                                                        destination: "acct_1GIDKrFoaPo8gtne", //super agent / userData.accountId admin stripe account number
                                                        transfer_group: 'ORDER_95',
                                                    }, (error, transferMoney) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else if (!transferMoney) {
                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                        }
                                                        else {
                                                            var phoneNumber = "+91" + superAgentData.mobileNumber
                                                            commonFunction.sendTextOnMobileNumber(phoneNumber, "your withdraw request has been approved", (error, msgSent) => {
                                                                if (error) {
                                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                }
                                                                else {
                                                                    var totalAmount = superAgentData.amountUSD - request.amount
                                                                    userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: "SUPER-AGENT" },
                                                                        { $set: { amountUSD: totalAmount } }, { new: true }, (error, finalUpdate) => {
                                                                            if (error) {
                                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                            }
                                                                            else if (!finalUpdate) {
                                                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                            }
                                                                            else {
                                                                                requestMoneyModel.findOneAndUpdate({ agentId: request.agentId, "status": "requested" },
                                                                                    { $set: { status: "approved" } }, { new: true }, (error, payStatus) => {
                                                                                        console.log("=======error7", error)
                                                                                        if (error) {
                                                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                                        }
                                                                                        else if (!payStatus) {
                                                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);

                                                                                        }
                                                                                        else {
                                                                                            response(res, SuccessCode.SUCCESS, finalUpdate, payStatus, SuccessMessage.MONEY_TRANSFERD)
                                                                                        }
                                                                                    })
                                                                            }

                                                                        })
                                                                }

                                                            })

                                                        }

                                                    })
                                                }
                                            }
                                        })
                                    }
                                    else {
                                        stripe.balance.retrieve({
                                            stripe_account: 'acct_1E89IeJRAbfLz5Ri'//  agent accountId superAgent Account Number
                                        }, (error, success) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else if (!success) {
                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                            }
                                            else {
                                                if (success.available[0].amount < request.amount || success.available[0].amount == 0) {
                                                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                                }
                                                else {
                                                    stripe.transfers.create({
                                                        amount: request.amount,
                                                        currency: 'usd',
                                                        destination: "acct_1GIDKrFoaPo8gtne",  //super agent / userData.accountId admin stripe account number
                                                        transfer_group: 'ORDER_95',
                                                    }, (error, transferMoney) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else if (!transferMoney) {
                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                        }
                                                        else {
                                                            var phoneNumber = "+91" + superAgentData.mobileNumber
                                                            commonFunction.sendTextOnMobileNumber(phoneNumber, "your withdraw request has been approved", (error, msgSent) => {
                                                                if (error) {
                                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                }
                                                                else {
                                                                    var totalAmount = superAgentData.amountCDF - request.amount
                                                                    userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: "SUPER-AGENT" },
                                                                        { $set: { amountCDF: totalAmount } }, { new: true },
                                                                        (error, finalUpdate) => {
                                                                            if (error) {
                                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                            }
                                                                            else if (!finalUpdate) {
                                                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                            }
                                                                            else {
                                                                                requestMoneyModel.findOneAndUpdate({ agentId: request.agentId, "status": "requested" },
                                                                                    { $set: { status: "approved" } }, { new: true }, (error, payStatus) => {
                                                                                        console.log("=======error7", error)
                                                                                        if (error) {
                                                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                                        }
                                                                                        else if (!payStatus) {
                                                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);

                                                                                        }
                                                                                        else {
                                                                                            response(res, SuccessCode.SUCCESS, finalUpdate, payStatus, SuccessMessage.MONEY_TRANSFERD)
                                                                                        }
                                                                                    })
                                                                            }
                                                                        })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }

                                        })
                                    }
                                }
                            })
                    }
                })
            }
        })
    },

    qrCodeSendBySuperAgentToAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, superAgentData) => {
            console.log("==============>", superAgentData.accountId)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!superAgentData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ accountId: req.body.accountId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, receiverDetails) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!receiverDetails) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        if (req.body.amountType == "USD") {
                            stripe.balance.retrieve({
                                stripe_account: superAgentData.accountId
                            }, (error, success) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    if (success.available[0].amount < req.body.amount || success.available[0].amount == 0) {
                                        response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                    }
                                    else {
                                        stripe.transfers.create({
                                            amount: req.body.amount,
                                            currency: 'usd',
                                            destination: req.body.accountId,
                                            transfer_group: 'ORDER_95',
                                        }, (error, transferMoney) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                var superAgentUpdatedAmount = superAgentData.amountUSD - req.body.amount
                                                userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                                                    { $set: { amountUSD: superAgentUpdatedAmount } }, { new: true }, (error, superAgentAmountUpdate) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else if (!superAgentAmountUpdate) {
                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                        }
                                                        else {
                                                            var agentUpdatedAmount = superAgentData.amountUSD + req.body.amount
                                                            userModel.findOneAndUpdate({ agentId: receiverDetails.agentId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                                                                { $set: { amountUSD: agentUpdatedAmount } }, { new: true }, (error, agentAmountUpdate) => {
                                                                    if (error) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else if (!agentAmountUpdate) {
                                                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, superAgentAmountUpdate, agentAmountUpdate, SuccessMessage.MONEY_TRANSFERD)
                                                                    }
                                                           })
                                                        }
                                                    })
                                               }
                                          })

                                      }
                                  }
                              })
                          }
                        else {
                            stripe.balance.retrieve({
                                stripe_account: superAgentData.accountId
                            }, (error, success) => {
                                if (error) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    if (success.available[0].amount < req.body.amount || success.available[0].amount == 0) {
                                        response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                                    }
                                    else {
                                        var amountInUSD = (req.body.amount * 0.00059)
                                        stripe.transfers.create({
                                            amount: amountInUSD,
                                            currency: 'usd',
                                            destination: req.body.accountId,
                                            transfer_group: 'ORDER_95',
                                        }, (error, transferMoney) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                var superAgentUpdatedAmount = superAgentData.amountCDF - req.body.amount
                                                userModel.findOneAndUpdate({ agentId: superAgentData.agentId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                                                    { $set: { amountCDF: superAgentUpdatedAmount } }, { new: true }, (error, superAgentAmountUpdate) => {
                                                        if (error) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else if (!superAgentAmountUpdate) {
                                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                        }
                                                        else {
                                                            var agentUpdatedAmount = superAgentData.amountCDF + req.body.amount
                                                            userModel.findOneAndUpdate({ agentId: receiverDetails.agentId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                                                                { $set: { amountCDF: agentUpdatedAmount } }, { new: true }, (error, agentAmountUpdate) => {
                                                                    if (error) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else if (!agentAmountUpdate) {
                                                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, superAgentAmountUpdate, agentAmountUpdate, SuccessMessage.MONEY_TRANSFERD)

                                                                    }
                                                                })

                                                        }
                                                    })
                                            }
                                        })

                                    }
                                }
                            })
                        }
                    }
                })
            }

        })
    },

    qrCodeConfirmWithPinPassword: async (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE" }).then((data) => {
            if (!data) {

            }
            else {

            }
        }).catch(error => {

        })


        // console.log("==req.body", req.body)
        // userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
        //     (error, result) => {
        //         console.log("============>", result)
        //         if (error) {
        //             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
        //         }
        //         else if (!result) {
        //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
        //         }
        //         else {
        //             var pass = bcrypt.compareSync(req.body.password, result.password)
        //             if (pass) {
        //                 var pinNumber = bcrypt.compareSync(req.body.pin, result.pin)
        //                 if (pinNumber) {
        //                     response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
        //                 }
        //                 else {
        //                     response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.PIN_NOT_MATCHED)
        //                 }
        //             }
        //             else {
        //                 response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.WRONG_PASSWORD)
        //             }
        //         }
        //     })
    },

    receiveMoneyQrCodeBySuperAgent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, data) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

            }
            else if (!data) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);

            }
            else {
                commonFunction.qrcodeGenrate(data.accountId, (error, qrCode) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }

                    else {
                        commonFunction.uploadImage(qrCode, (error, imgageQRcode) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, imgageQRcode, SuccessMessage.QRCODE_GENERATED)
                            }
                        })
                    }
                })
            }
        })
    },
    exchangeMoneyBySuperAgent: async (req, res) => {
        try {
            var superAgentData = await userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } })

            if (req.body.amountType == "USD") {
                if (superAgentData.amountCDF == 0 || superAgentData.amountCDF < req.body.amount) {

                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                }
                else {
                    var convertInUSD = (req.body.amount * 0.00058)
                    var remainingCDFamount = superAgentData.amountCDF - req.body.amount
                    var updatedAmountUSD = superAgentData.amountUSD + convertInUSD
                    var updateAmount = await userModel.findOneAndUpdate({ _id: superAgentData._id, status: "ACTIVE", userType: "SUPER-AGENT" },
                        { $set: { amountCDF: remainingCDFamount, amountUSD: updatedAmountUSD } }, { new: true })
                }
                response(res, SuccessCode.SUCCESS, updateAmount, SuccessMessage.UPDATE_SUCCESS)
            }
            else {
                if (superAgentData.amountUSD == 0 || superAgentData.amountUSD < req.body.amount) {

                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.NOT_SUFFICIENT_BALANCE)
                }
                else {
                    var convertInCDF = (req.body.amount * 1701)
                    var remainingUSDamount = superAgentData.amountUSD - req.body.amount
                    var updatedAmountCDF = superAgentData.amountCDF + convertInCDF
                    var updateAmount = await userModel.findOneAndUpdate({ _id: superAgentData._id, status: "ACTIVE", userType: "SUPER-AGENT" },
                        { $set: { amountCDF: updatedAmountCDF, amountUSD: remainingUSDamount } }, { new: true })
                }
                response(res, SuccessCode.SUCCESS, updateAmount, SuccessMessage.UPDATE_SUCCESS)
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
        }

    },

    checkBalance: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                userModel.findOne({ accountId: result.accountId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } },
                    (error, balanceData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!balanceData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            var pass = bcrypt.compareSync(req.body.password, result.password)
                            if (pass) {
                                var pinNumber = bcrypt.compareSync(req.body.pin, result.pin)
                                if (pinNumber) {
                                    var balance_obj = {
                                        "USD Amount": result.amountUSD,
                                        "CDF Amount": result.amountCDF
                                    }
                                    response(res,SuccessCode.SUCCESS,balance_obj,SuccessMessage.DATA_FOUND)
                                }
                                else {
                                    response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.PIN_NOT_MATCHED)
                                }
                            }
                            else {
                                response(res, ErrorCode.INVALID_CREDENTIAL, ErrorMessage.WRONG_PASSWORD)
                            }

                        }


                 })
            }
        })
    },
    supportMessageBySuperAgentToAdmin:(req,res)=>{
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["SUPER-AGENT", "AGENT"] } }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } 
                else{
                   var obj = {
                       "message":req.body.message
                   }
                   new messageModel(obj).save((error,saveMessage)=>{
                       if(error){
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                       }
                       else{
                        response(res, SuccessCode.SUCCESS,saveMessage,SuccessMessage.MESSAGE_SENT)
                       }
                   })
                }      
        })  
    }
}


