const { commonResponse: response } = require('../helper/responseHandler')
const { ErrorMessage } = require('../helper/responseMessege')
const { ErrorCode } = require('../helper/responseCode')

/**
 * signUpValidation validation
 **/
exports.signUpValidation = function (req, res, next) {
    if( !req.body.firstName ||!req.body.lastName||!req.body.countryCode|| !req.body.mobileNumber || !req.body.password){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}

/**
 * socialSignUpValidation validation
 **/
exports.socialSignUpValidation = function (req, res, next) {
    if(!req.body.socialId || !req.body.socialType){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}

/**
 * loginValidation validation
 **/
exports.loginValidation = function (req, res, next) {
    if(!req.body.mobileNumber  ||  !req.body.password){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}

/**
 * webLoginValidation validation
 **/
exports.webLoginValidation = function (req, res, next) {
    if(!req.body.email  ||  !req.body.password || !req.body.browserId){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}

/**
 * setPinValidation validation
 **/
exports.setPinValidation = function (req, res, next) {
    if(!req.body.userName || !req.body.pin){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}
/**
 * verifyOtpValidation validation
 **/
exports.verifyOtpValidation = function (req, res, next) {
    if(!req.body.mobileNumber || !req.body.otp){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}

/**
 * userIdValidation validation
 **/
exports.userIdValidation = function (req, res, next) {
    if(!req.body.userId){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}


/**
 * emailValidation validation 
 **/
exports.mobileValidation = function (req, res, next) {
    if(!req.body.mobileNumber){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}


/**
 * resetPasswordValidation validation  
 **/
exports.resetPasswordValidation = function (req, res, next) {
    if(!req.body.newPassword || !req.body.confirmPassword){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}



/**
 * userNameValidation validation  
 **/
exports.userNameValidation = function (req, res, next) {
    if(!req.body.userName){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}



/**
 * bannerValidation validation  
 **/

exports.bannerValidation = function(req, res, next) {
    if(!req.body._id){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }
    else{
        next()
    }
}


exports.ticketValidation = function(req, res, next) {
    if(!req.body.ticketId){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }
    else{
        next()
    }
}


/**
 * subAdminIdValidation validation
 **/
exports.subAdminIdValidation = function (req, res, next) {
    if(!req.body.subAdminId){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}


/**
 * changePasswordValidation validation  
 **/
exports.changePasswordValidation = function (req, res, next) {
    if(!req.body.userId || !req.body.newPassword || ! req.body.confirmPassword || !req.body.oldPassword){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}


/**
 * staticContentValidation validation  
 **/
exports.staticContentValidation = function (req, res, next) {
    if(!req.body.Type || !req.body.description || ! req.body.title){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
 
}
/**
 * Faq validation  
 **/

exports.faqValidation = function(req, res, next) {
    if(!req.body.faqId || !req.body.question || ! req.body.answer){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
}

