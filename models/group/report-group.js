const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const reportGroupSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    group:{type:mongoose.Schema.Types.ObjectId, ref:'Group', required:true},
    body:{type:String, maxlength:1000},
    timeStamp:{type:Date, default:Date.now},
    chatHistory:{type:String, minlength:3, maxlength:1000}
});

const ReportGroup = mongoose.model('ReportGroup', reportGroupSchema);

const reportGroupJoiSchema = Joi.object({
    group:Joi.objectId().required(),
    body:Joi.string().max(1000),
});

const validate = function(body) {
    return reportGroupJoiSchema.validate(body);
}

exports.ReportGroup = ReportGroup;
exports.validate = validate;