module.exports = {

    commonResponse: (res, statusCode, result, message)=>{
    

            return res.json({
                response_code: statusCode,
                response_message: message || '',
                result: result || ''
                
            })
        },
    sendResponseWithPagination : (responseObj , responseCode, responseMessage, data, paginationData) =>{
        return responseObj.send({'response_code':responseCode,'response_message':responseMessage,result:data,paginationData:paginationData ||''})
    },
    sendResponseWithData: (responseObj, responseCode, responseMessage, data, tokn) => {
        return responseObj.send({'response_code':responseCode,'response_message':responseMessage,result:data, token:tokn});
    },
    sendResponseWithoutData: (responseObj, responseCode, responseMessage) => {
        return responseObj.send({'response_code':responseCode,'response_message':responseMessage});
    }
};