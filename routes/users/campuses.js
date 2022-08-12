const express = require('express');
const validObjectId = require('../../middlewares/validObjectId');
const { Campus, validate } = require('../../models/user/campus');
const router = express.Router();


router.get('/', async (req, res)=>{
    const campuses = await Campus.find();
    res.status(200).send(campuses);
});

router.get('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const campus = await Campus.findById(id);
    if(!campus) return res.status(404).send('No campus found');

    res.status(200).send(campus);
});

//TODO: Protect post request with token
router.post('/', async (req, res)=>{
    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error);

    const campus = new Campus({name:value.name});
    const result = await campus.save();
    res.status(201).send(result);
})

router.delete('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const campus = await Campus.findById(id);
    if(!campus) return res.status(404).send('No campus found');

    const result = await campus.remove();

    res.status(200).send(result);
})




module.exports = router;