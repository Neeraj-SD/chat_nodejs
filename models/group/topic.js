const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const topicSchema = mongoose.Schema({
    name:{type:String, minlength:1, maxlength:255, required:true}
});

const Topic = mongoose.model('Topic', topicSchema);

const topicJoiSchema = Joi.object({
    name:Joi.string().required().min(3).max(255)
});

const validate = function(body) {
    return topicJoiSchema.validate(body);
}

exports.Topic = Topic;
exports.validate = validate;