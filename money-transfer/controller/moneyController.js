const userModel = require("../model/userModel");
const moneyModel = require("../model/moneyModel")
const { commonResponse: response } = require('../helper/responseHandler')
const { ErrorMessage } = require('../helper/responseMessege')
const { SuccessMessage } = require('../helper/responseMessege')

const { SuccessCode } = require('../helper/responseCode')
const { ErrorCode } = require('../helper/responseCode')
const bcrypt = require("bcrypt-nodejs");
const commonFunction = require('../helper/commonFunction')
const jwt = require('jsonwebtoken');
var auth = require('.././middleWare/auth');

module.exports = {
    setMoney: (req, res) => {
        console.log("=========================")
        commonFunction.jwtDecode(req.headers.token, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

            }
            else {

                req.body.forEach(item => {
                    new moneyModel(item).save((error, savedData) => {
                        if (error) {
                            console.log(error, savedData)
                        }
                        else {
                            console.log(error, savedData)
                        }
                    })
                })
                response(res, SuccessCode.SUCCESS, [], SuccessMessage.DATA_SAVED)

            }
        })
    }
}