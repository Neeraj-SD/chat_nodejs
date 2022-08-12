const mongoose = require('mongoose')
const Joi = require('joi');
const uuid = require('uuid');
Joi.objectId = require('joi-objectid')(Joi)

const groupSchema = mongoose.Schema({
    name:{type:String, required:true, minlength:3, maxlength:255},
    inviteCode:{type:String, default:uuid.v1},
    private:{type:Boolean, default:true, required:true},
    admin:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    topic:{type:mongoose.Schema.Types.ObjectId, ref:'Topic', required:true},
    users:[{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}],
    avatar:{type:mongoose.Schema.Types.ObjectId, ref:'GroupAvatar', required:true},
    campus:{type:mongoose.Schema.Types.ObjectId, ref:'Campus'},
    timeStamp:{type:Date, default:Date.now}
});

const Group = mongoose.model('Group', groupSchema);

const groupJoiSchema = Joi.object({
    name:Joi.string().min(3).max(255).required(),
    private:Joi.boolean(),
    topic:Joi.objectId().required(),
    avatar:Joi.objectId().required(),
});

const validate = function(body) {
    return groupJoiSchema.validate(body);
}

Group.prototype.isAdmin = function(userId) {
    if(!this.admin.equals(userId)) return false;
    return true;
}

Group.prototype.hasMember =  function(userId) {
    if(!this.users.includes(userId)) return false;
    return true;
}

exports.Group = Group;
exports.validate = validate;