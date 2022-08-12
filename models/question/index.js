const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const uuid = require('uuid');

const {QuestionResponseSchema} = require('./question-response')

const questionSchema = mongoose.Schema({
    uid:{type:String, default:uuid.v1, required:true},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    body:{type:String, required:true, minlength:3, maxlength:1000},
    timeStamp:{type:Date, default:Date.now, required:true},
    responses:{
        type:[QuestionResponseSchema],
        default:[]
    }
});

const Question = mongoose.model('Question', questionSchema);

const questionJoiSchema = Joi.object({
    body:Joi.string().min(3).max(1000).required(),
});

const validate = function(body) {
    return questionJoiSchema.validate(body);
}

exports.Question = Question;
exports.validate = validate;