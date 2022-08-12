const express = require('express');
const auth = require('../../middlewares/auth');
const validObjectId = require('../../middlewares/validObjectId');
const { User } = require('../../models/user');
const { Group } = require('../../models/group');
const {GroupMessage, validate} = require('../../models/group/group-message');
const { publishMessage } = require('../../startup/redis-client');
const router = express.Router();

const sendRedisMessage = async (message, user) => {
    //TODO: Create new Redis-Channel-ID
    //TODO: Delete message after the client recieves it

    const recieved = await publishMessage(message.body, user._id.toString());
    if(recieved>0) {
        message.deliveredTo.push(user._id);
        await message.save();
        console.log('Client recieved message');
    } else {
        console.log('Client did not receive message');
    }
}

router.post('/send/:id', [auth, validObjectId('id')], async (req, res) => {
    const toGroupId = req.params.id;

    const toGroup = await Group.findById(toGroupId);
    if(!toGroup) return res.status(404).send("group not found");

    const {value, error} = validate(req.body);
    if(error) return res.status(400).send(error);

    const message = new GroupMessage({
        body:value.body,
        _from:req.user.id,
        group:toGroupId,
        readBy:[],
    });

    await message.save();
    toGroup.users.forEach(user=>{
        sendRedisMessage(user, message);
    })
    sendRedisMessage(message, toUser)
    return res.status(201).send(message);
});

router.get('/unread', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).send("User not found");
    
    const messages = await GroupMessage.find({to:req.user.id});
    
    messages.forEach( x=>{
        x.status='delivered'
        x.save();
    })
    
    return res.status(200).send(messages);
});

router.get('/chat/:id', [auth, validObjectId('id')], async (req, res) => {
    const group = await Group.findById(req.params.id);
    if(!group) return res.status(404).send("Group not found");
    
    const messages = await GroupMessage
                            .find({group:group._id})
    
    messages.forEach( x=>{
        x.status='delivered'
        x.save();
    })
    
    return res.status(200).send(messages);
});




module.exports = router;