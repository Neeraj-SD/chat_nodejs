const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth');
const validObjectId = require('../../middlewares/validObjectId');
const {Question, validate} = require('../../models/question/index')

const responses = require('./responses');

router.use('/responses', responses);

router.get('/', auth ,async (req, res)=>{
    const questions = await Question.find({user:req.user.id});
    res.status(200).send(questions);
});

router.post('/', auth, async (req, res)=>{
    const {error, value} = validate(req.body);
    if(error) return res.status(400).send(error);

    const question = new Question({
        user:req.user.id,
        body:value.body,
    })

    const result = await question.save();

    res.status(201).send(result);
});

router.get('/:questionId', [auth, validObjectId('questionId')], async (req, res)=>{
    const id = req.params.questionId;

    const question = await Question.findById(id);
    if(!question) return res.status(404).send("Question was not found");

    res.status(200).send(question);
});


module.exports = router;