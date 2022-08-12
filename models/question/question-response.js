const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const questionResponse = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    body:{type:String, minlength:1, maxlength:1000, required:true},
});

const QuestionResponse = mongoose.model('QuestionResponse', questionResponse);

const questionResponseJoiSchema = Joi.object({
    body:Joi.string().min(1).max(1000).required(),
});

const validate = function(body) {
    return questionResponseJoiSchema.validate(body);
}

exports.QuestionResponse = QuestionResponse;
exports.QuestionResponseSchema = questionResponse;
exports.validate = validate;