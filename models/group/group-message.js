const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const groupMessageSchema = mongoose.Schema({
    from:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    group:{type:mongoose.Schema.Types.ObjectId, ref:'Group', required:true},
    deliveredTo:[{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}],
    readBy:[{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}],
    timeStamp:{type:Date, default:Date.now},
    body:{type:String, minlength:1, maxlength:1000, required:true}
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);

const groupMessageJoiSchema = Joi.object({
    body:Joi.string().min(1).max(1000).required()
});

const validate = function(body) {
    return groupMessageJoiSchema.validate(body);
}

exports.GroupMessage = GroupMessage;
exports.validate = validate;