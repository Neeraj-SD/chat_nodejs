const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const userMessageSchema = mongoose.Schema({
    _from:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    _to:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    body:{type:String, required:true, minlength:1, maxlength:1000},
    timeStamp:{type:Date, default:Date.now},
    status:{type:String, enum:['delivered','read', 'sent'], default:'sent'}
});

const UserMessage = mongoose.model('UserMessage', userMessageSchema);

const userMessageJoiSchema = Joi.object({
    body:Joi.string().required().min(1).max(1000),
});

const validate = function(body) {
    return userMessageJoiSchema.validate(body);
}

exports.UserMessage = UserMessage;
exports.validate = validate;