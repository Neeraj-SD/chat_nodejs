const express = require('express');
const validObjectId = require('../../middlewares/validObjectId');
const { Interest, validate } = require('../../models/user/interest');
const router = express.Router();


router.get('/', async (req, res)=>{
    const interests = await Interest.find();
    res.status(200).send(interests);
});

router.get('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const interest = await Interest.findById(id);
    if(!interest) return res.status(404).send('No interest found');

    res.status(200).send(interest);
});

//TODO: Protect post request with token
router.post('/', async (req, res)=>{
    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error);

    const interest = new Interest({name:value.name});
    const result = await interest.save();
    res.status(201).send(result);
})

router.delete('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const interest = await Interest.findById(id);
    if(!interest) return res.status(404).send('No interest found');

    const result = await interest.remove();

    res.status(200).send(result);
})




module.exports = router;