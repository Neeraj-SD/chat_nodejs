const express = require('express');
const validObjectId = require('../../middlewares/validObjectId');
const {Topic, validate} = require('../../models/group/topic');
const router = express.Router();


router.get('/', async (req, res)=>{
    const topics = await Topic.find();
    res.status(200).send(topics);
});

router.get('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const topics = await Topic.findById(id);
    if(!topics) return res.status(404).send('No topic found');

    res.status(200).send(topics);
});

//TODO: Protect post request with token
router.post('/', async (req, res)=>{
    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error);

    const topic = new Topic({name:value.name});
    const result = await topic.save();
    res.status(201).send(result);
})

router.delete('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const topic = await Topic.findById(id);
    if(!topic) return res.status(404).send('No topic found');

    const result = await topic.remove();

    res.status(200).send(result);
})




module.exports = router;