const express = require('express');
const auth = require('../../middlewares/auth');
const validObjectId = require('../../middlewares/validObjectId');
const { Group, validate } = require('../../models/group');
const { User } = require('../../models/user');
const router = express.Router();

const avatars = require('./avatars');
const messages = require('./messages');
const report = require('./report');
const topics = require('./topics');


router.post('/', [auth], async (req, res)=> {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).send("User not found");

    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error)

    const group = new Group({
        name:value.name,
        private:value.private,
        topic:value.topic,
        avatar:value.avatar,
        admin:user._id,
        campus:user.campus,
    });

    const result = await group.save();
    res.status(201).send(result)
});

router.post('/join/:id', [auth, validObjectId('id')], async (req, res)=>{
    const group = await Group.findById(req.params.id);
    console.log([req.body.inviteCode,(group.inviteCode)]);
    if(!req.body.inviteCode || req.body.inviteCode !== (group.inviteCode)) return res.status(400).send('Invalid invite code');
    group.users.push(req.user.id);
    await group.save();
    res.status(201).send('Group is joined');

});

router.get('/:id', [auth, validObjectId('id')], async (req, res)=>{
    const id  = req.params.id;

    const group = await Group.findById(id)
                            .populate({
                                path:'users',
                                model:'User',
                                select:{_id:1, nickName:1, avatar:1}
                            }).populate({
                                path:'admin',
                                model:'User',
                                select:{_id:1, nickName:1, avatar:1}
                            }).populate('avatar topic campus');

    if(!group) return res.status(404).send("Group not found");

    res.status(200).send(group);
});

router.delete('/:id', [auth, validObjectId("id")], async (req, res)=>{
    const id  = req.params.id;

    const group = await Group.findById(id);

    if(!group) return res.status(404).send("Group not found");

    if(!group.isAdmin(req.user.id)) return res.status(403).send("User is not admin");

    const result = await group.remove();

    res.status(200).send(result);

});

router.post('/kick-user/:id', [auth, validObjectId('id')], async (req, res) => {
    const id = req.params.id;

    const group = await Group.findById(id);
    if(!group)  return res.status(404).send("Group not found");

    if(!group.isAdmin(req.user.id)) return res.status(403).send("User is not admin");

    const userId = req.body.user;
    if(!userId) return res.status(400).send('Invalid user');

    const user = await User.findById(userId);
    if(!user) return res.status(404).send('User not found');
    if(!group.hasMember(userId)) return res.status(400).send("user not in group");

    const result = await group.users.remove(userId);
    res.status(200).send(group);
});

router.get('/recommendations', auth, async (req, res)=>{

});

router.get('/search/:key', auth, async (req, res) => {
    const key = req.params.key;

    const groups = await Group.find({name: {$regex: new RegExp("w*"+key+"w*",'i')}});

    return res.status(200).send(groups);
})







router.use('/avatars', avatars);
router.use('/messages', messages);
router.use('/report', report);
router.use('/topics', topics);

module.exports = router;