const auth = require('basic-auth');
const { config } = require('../config/config')
const { commonResponse: response } = require('../helper/responseHandler')
const { ErrorMessage } = require('../helper/responseMessege')
const { ErrorCode } = require('../helper/responseCode')
const userModel = require('../model/userModel');
var jwt = require('jsonwebtoken');

// Function Name : verify token 
// Description - verify  whether token and userid is passed in the header or not 
// token is required 

exports.verifyToken = (req, res, next) => {
    if (req.headers.token) {
        jwt.verify(req.headers.token, 'moneyTransfer', (err, result) => {
            console.log("hhshhs", result)
            if (err) {
                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.INCORRECT_JWT);
            }
            else {
                userModel.findOne({ _id: result.id }, (error, result2) => {
                    //console.log("hhshhs",result2)
                    if (error)
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    else if (!result2) {
                        response(res, ErrorCode.USER_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                    }
                    else {
                        if (result2.status == 'BLOCK') {
                            response(res, ErrorCode.FORBIDDEN, [], ErrorMessage.BLOCKED_BY_ADMIN);
                        } else if (result2.status == 'DELETE') {
                            response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.DELETED_BY_ADMIN);
                        } else {
                            req.userId= result.id;
                            next();
                        }

                    }
                })
            }
        })
    } else {
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.NO_TOKEN)
    }

}


