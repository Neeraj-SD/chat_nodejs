const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const connectionSchema = mongoose.Schema({
    from:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    to:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    timeStampp: {type: Date, default:Date.now},
});

const Connection = mongoose.model('Connection', connectionSchema);

const connectionJoiSchema = Joi.object({
});

const validate = function(body) {
    return connectionJoiSchema.validate(body);
}

exports.Connection = Connection;
exports.validate = validate;