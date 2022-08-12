const express = require('express');
const validObjectId = require('../../middlewares/validObjectId');
const { UserAvatar, validate } = require('../../models/user/user-avatar');
const router = express.Router();

router.get('/', async (req, res)=>{
    const avatars = await UserAvatar.find();
    res.status(200).send(avatars);
});

router.get('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const avatar = await UserAvatar.findById(id);
    if(!avatar) return res.status(404).send('No avatar found');

    res.status(200).send(avatar);
});

//TODO: Protect post request with token
router.post('/', async (req, res)=>{
    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error);

    const avatar = new UserAvatar({name:value.name, url:value.url});
    const result = await avatar.save();
    res.status(201).send(result);
})

router.delete('/:id', [validObjectId('id')], async (req, res)=>{
    const id = req.params.id;

    const avatar = await UserAvatar.findById(id);
    if(!avatar) return res.status(404).send('No avatar found');

    const result = await avatar.remove();

    res.status(200).send(result);
})




module.exports = router;