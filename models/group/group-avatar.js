const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const groupAvatarSchema = mongoose.Schema({
    name:{type:String, minlength:3, maxlength:255, required:true},
    url:{type:String, minlength:3, maxlength:1000, required:true},
    topics:[{type:mongoose.Schema.Types.ObjectId, ref:'Topic', required:true}]
});

const GroupAvatar = mongoose.model('GroupAvatar', groupAvatarSchema);

const groupAvatarJoiSchema = Joi.object({
    name:Joi.string().min(3).max(255).required(),
    url:Joi.string().min(3).max(1000).required(),
    topics:Joi.array().items(Joi.objectId()),
});

const validate = function(body) {
    return groupAvatarJoiSchema.validate(body);
}

exports.GroupAvatar = GroupAvatar;
exports.validate = validate;