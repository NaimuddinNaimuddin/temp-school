
/** 
 * @description All the Error messages that needed to be sent to Admin or App
 * @type {Object}
*/
module.exports.ErrorMessage = Object.freeze({
    INVALID_TOKEN: 'Unauthorized user',
    INTERNAL_ERROR : 'Internal Server Error.',
    INVALID_CREDENTIAL:'Invalid credentials.',
    SOMETHING_WRONG:'Something went wrong!',
    EMAIL_NOT_REGISTERED:'Email not registered.',
    RESET_PASSWORD_EXPIRED:'Token expired.',
    WRONG_PASSWORD:'Please enter a valid password.',
    EMAIL_EXIST:'Email already exists. Please try again with different email id.',
    EMAIL_NOT_EXIST:'Email does not exists.',
    NOT_FOUND:'Data not found.',
    USER_NOT_FOUND:'User not found.',
    MOBILE_EXIST:'Mobile number already exists.',
    USERNAME_EXIST:'User name already exists.',
    USER_ID:'User Id required.',
    BLOCKED_BY_ADMIN:'You are blocked by admin please contact to Admin.',
    DELETED_BY_ADMIN:'Your account deleted, please contact to Admin.',
    FIELD_REQUIRED:'Fields are required.',
    OLD_PASSWORD:'Old password did not match.',
    PIN_NOT_MATCHED:'pin did not match.', 
    INCORRECT_JWT:'Invalid JWT token.',
    NO_TOKEN:'No token provided.',
    PASSWORD_INVALID:"Old password incorrect.",
    NOT_MATCH: "Password does not match.",
    BROWSER_FOUND:"Browser id not found.",
    BANNER_EXIST:"Banner already exists.",
    BANNER_FOUND:"No such banner found.",
    TERMS_CONDITION:"Terms and Conditions already exists.",
    STATIC_EXIST:"Static page already exists.",
    MOBILE_NOT_FOUND:"Mobile number not found.",
    INVALID_OTP: 'Invalid OTP.',
    OTP_EXPIRED:"OTP expired.",
    UPDATE_NOT:"Cannot update.",
    DATA_EXIST: 'Data already exists.',
    EMAIL_NOT_SEND:"Failed to send email. Please try after sometime.",
    ANSWER_NOT_MATCH:"Answer not match",
    NOT_SUFFICIENT_BALANCE:"Not suffiecient balance"

   
});

/** 
 * @description All the Success messages that needed to be sent to App or Admin
 * @type {Object}
*/
module.exports.SuccessMessage = Object.freeze({
    ACCOUNT_CREATION: 'Your account has been created successfully.',
    LOGIN_SUCCESS: 'You have successfully login.', 
    FORGET_SUCCESS: 'Password link has been send successfully on your email.', 
    RESET_SUCCESS:'Password changed successfully.', 
    DELETE_SUCCESS:'Deleted successfully.', 
    UPDATE_SUCCESS:'Updated successfully.',
    BLOCK_SUCCESS:'Blocked successfully.',
    ACTIVE_SUCCESS:'Activated successfully.',
    DATA_SAVED:'Data saved succcessfully.',
    PRODUCT_LIST_FETCH:'Product list fetch successfully.',
    USER_LIST_FETCH:'User list fetch successfully.',
    AUTHORIZATION:'Authorized user.',
    OTP_SEND: 'Otp send to your registered mobile number.',
    EMAIL_SEND: 'Email sent to your email Id.',
    LINK_SEND: 'Link send to your registered email.',
    VERIFY_OTP: 'OTP verified successfully.',
    PIN_SET:"Pin set successfully.",
    PASSWORD_UPDATE:"Password updated successfully.",
    DETAIL_GET:"Details have been fetched successfully.",
    PROFILE_DETAILS:"Your profile details updated sucessfully.",
    DATA_FOUND:"Data found successfully.", 
    ADD_TO_CART: "Product added to cart successfully.",
    WISH_LIST:"Product added to wish list successfully.",
    WISHLIST_REMOVE:"Product removed from wish list successfully.",
    BANNER_ADD:"Banner added successfully.",
    BANNER_BLOCK:"Banner blocked successfully.",
    BANNER_UNBLOCK:"Banner unblocked successfully.",
    BANNER_DELETE:"Banner deleted successfully.",
    PRODUCT_REMOVE:"Product removed from  cart successfully.",
    TICKET_SUCCESS:"Ticket created successfully.",
    TICKET_DELETE:"Ticket deleted successfully.",
    TICKET_BLOCK:"Ticket blocked successfully.",
    TICKET_UNBLOCK:"Ticket unblocked successfully.",
    TICKET_ANSWER:"Ticket has been answered successfully.",
    NOTIFICATION_SAVED:"Notification saved successfully.",
    TICKET_ASSIGN:"Ticket assigned successfully.",
    REVIEW_ADD:"Review added successfully.",
    TERMS_CONDITION_ADDED:"Terms and Conditions added successfully.",
    TERMS_CONDITIONS_DELETE:"Terms and Conditions deleted successfully.",
    TERMS_CONDITIONS_ACTIVE:"Terms and conditions active successfully.",
    SUB_ADMIN:"Sub admin created successfully.",
    SUB_ADMIN_DELETE:"Sub admin deleted successfully.",
    SUB_ADMIN_BLOCK:"Sub admin blocked successfully.",
    SUB_ADMIN_UNBLOCK:"Sub admin unblocked successfully.",
    ROLE_CHANGED:"Role changed successfully.", 
    PROCEED_CHECKOUT:"Total amount added for proceed to checkout.",
    STATIC_CONTENT:"Static content added successfully.",
    STATIC_BLOCK:"Static content blocked successfully.",
    STATIC_UNBLOCK:"Static content unblocked successfully.",
    STATIC_CONTENT_FOUND:'Static content data found.',
    EMAIL_SHARE: "Email sharing done successfully",
    ANSWER_MATCH:"Answer match",
    REQUEST_SENT:"Request sent to admin",
    MONEY_TRANSFERD:"Money has been transferd",
    QRCODE_GENERATED:"QR code generated",
    CONVERT_AMOUNT:"Amount converted Successfully",
    MESSAGE_SENT:"Message sent"



   
});