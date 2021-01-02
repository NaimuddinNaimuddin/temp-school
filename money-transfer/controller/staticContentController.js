const staticPage = require("../model/staticContentModel");
const faqModel = require("../model/faqModel")
const { commonResponse: response } = require('../helper/responseHandler')
const { ErrorMessage } = require('../helper/responseMessege')
const { SuccessMessage } = require('../helper/responseMessege')

const { SuccessCode } = require('../helper/responseCode')
const { ErrorCode } = require('../helper/responseCode')


module.exports = {

    /**
    * Function Name :viewStaticContent
    * Description   : view static content in static management
    *
    * @return response
  */

    viewStaticContent: (req, res) => {
        try {
            if (req.body.Type && !req.body.staticId) {
                staticPage.find({ Type: req.body.Type }, (err, result) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (result.length == 0) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessag.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                    }
                })

            }
            else if (!req.body.Type && req.body.staticId) {
                staticPage.findOne({ _id: req.body.staticId }, (err, result) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                    }
                })
            }
            else if (req.body.Type && req.body.staticId) {
                staticPage.findOne({ _id: req.body.staticId, Type: req.body.Type }, (err, result) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessag.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                    }
                })
            }
            else {
                response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editStaticContent
     * Description   : edit static content in static management
     *
     * @return response
    */

    editStaticContent: (req, res) => {
        try {
            console.log("===========>")
            staticPage.findOne({ _id: req.body.staticId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    staticPage.findOneAndUpdate({ _id: req.body.staticId }, { $set: req.body }, { new: true, runValidators: true }, (updateErr, updateResult) => {
                        if (updateErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :staticContentList
     * Description   :  static content list of static management
     *
     * @return response
    */

    staticContentList: (req, res) => {
        try {
            // req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 1000,
                sort: { createdAt: -1 }
            };
            var query = { status: { $ne: "DELETE" }, Type: ["ABOUT_US", "TERMS", "PRIVACY", "FAQ"] };

            if (req.body.search) {
                query.title = { $regex: req.body.search, $options: 'i' };

            }
            if (req.body.Type) {
                query.Type = req.body.Type;
            }
            if (req.body.status) {
                query.status = req.body.status;
            }
            staticPage.paginate(query, options, (error, paginationData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (paginationData.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, paginationData, SuccessMessage.DATA_FOUND);
                }
            })
   
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
       * Function Name :addFaq
       * Description   :  add Faqs in FAQS of static management
       *
       * @return response
      */
    addFaqs: (req, res) => {
        try {
            staticPage.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (error, faqData) => {
                console.log("==========>", error, faqData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!faqData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var obj = new faqModel({
                        faqId: faqData._id,
                        question: req.body.question,
                        answer: req.body.answer
                    })
                    obj.save((error, savedData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, savedData, SuccessMessage.SUCCESS);
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
          * Function Name :editFaq
          * Description   :  edit Faqs in FAQS of static management
          *
          * @return response
         */
    editFaqs: (req, res) => {
        try {
            faqModel.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (error, faqData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!faqData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var obj = {}
                    if (req.body.question) {
                        obj.question = req.body.question
                    }
                    if (req.body.answer) {
                        obj.answer = req.body.answer
                    }
                    faqModel.findOneAndUpdate({_id:faqData._id}, { $set: obj }, { new: true }, (error, updateFaqData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!updateFaqData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateFaqData, SuccessMessage.UPDATE_SUCCESS);
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
        * Function Name :view Faq
        * Description   :  faq list of FAQ in  static management
        *
        * @return response
       */

    viewFaq: (req, res) => {
        try {
            faqModel.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (error, faqData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!faqData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, faqData, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
    * Function Name :faq List
    * Description   :  faq list of FAQ in  static management
    *
    * @return response
   */

    faqList: (req, res) => {
        try {
            // req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 1000,
                
            };
            var query = { status: { $ne: "DELETE" } };

            if (req.body.search) {
                query.title = { $regex: req.body.search, $options: 'i' };

            }
            if (req.body.Type) {
                query.Type = req.body.Type;
            }
            if (req.body.status) {
                query.status = req.body.status;
            }
            faqModel.paginate(query, options, (error, paginationData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (paginationData.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, paginationData, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    }, 

}