const express = require('express');
const o_auth = require('../../middlewares/o_auth');
const router = express.Router()
const _ = require('lodash');
const { validate, User } = require('../../models/user');
const { Campus } = require('../../models/user/campus');
const { UserAvatar } = require('../../models/user/user-avatar');
const { Interest } = require('../../models/user/interest');
const bcrypt = require('bcryptjs/dist/bcrypt');

router.post('/register', o_auth , async (req, res)=>{
    const {error, value} = validate(req.body);
    if(error) return res.status(400).send(error);

    if(value.domain==="campus"){
        const campus = await Campus.findById(value.campus);
        if(!campus) return res.status(404).send('Campus not found');
    }
    
    const avatar = await UserAvatar.findById(value.avatar);
    if(!avatar) return res.status(404).send('Avatar not found');

    for (const interestId of value.interests) {
        const interest = await Interest.findById(interestId);
        if(!interest) return res.status(404).send("Interest not found "+interestId);
    }

    const user  = new User({
        ...value, 
        google_uid:req.userid,
        email:req.email
    })

    await user.save()

    const salt = await bcrypt.genSalt(10);
    const hashed_google_uid = await bcrypt.hash(req.userid, salt);
    await user.updateOne({ google_uid: hashed_google_uid })
    const result = await user.save()

    res.header('x-auth-token', result.generateAuthToken()).status(201).send(await result.getAnonymousUser())
});

router.post('/login', o_auth, async (req, res)=>{
    const user = await User.findOne({email:req.email});
    if(!user) return res.status(404).send("User not found");


    // const validGoogleUid = await bcrypt.compare(req.userid, user.google_uid)
    // if (!validGoogleUid) return res.status(403).send('Invalid credentials.')

    res.header().status(200).send(await user.getAnonymousUser())

})

module.exports = router;