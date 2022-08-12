const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth');

const validObjectId = require('../../middlewares/validObjectId');
const {Question, validate:ValidateQuestion} = require('../../models/question/index')
const {QuestionResponse, validate} = require('../../models/question/question-response');

router.post('/:questionId', [auth, validObjectId('questionId')], async (req, res)=>{
    const id = req.params.questionId;

    const question = await Question.findById(id);
    if(!question) return res.status(404).send("Question was not found");

    const {error, value} = validate(req.body);
    if(error) return res.status(400).send(error);

    const questionResponse =  new QuestionResponse({
        body:value.body,
        user:req.user.id,
    });

    question.responses.push(questionResponse);


    const result = await question.save()

    res.status(200).send(result);
});




module.exports = router;
