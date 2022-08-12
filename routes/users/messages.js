const express = require('express');
const auth = require('../../middlewares/auth');
const validObjectId = require('../../middlewares/validObjectId');
const { User } = require('../../models/user');
const { UserMessage, validate } = require('../../models/user/user-message');
const { publishMessage } = require('../../startup/redis-client');
const router = express.Router();

const sendRedisMessage = async (message, user) => {
    //TODO: Create new Redis-Channel-ID
    //TODO: Delete message after the client recieves it
    const recieved = await publishMessage(message, user.toString());
    console.log('received: ' + recieved)
    if (recieved > 0) {
        message.status = 'delivered';
        // await message.save();
        console.log('Client recieved message');
    } else {
        console.log('Client did not receive message');
    }
}

router.post('/send/:id', [auth, validObjectId('id')], async (req, res) => {
    const toUserId = req.params.id;

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).send("User not found");

    const { value, error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const message = new UserMessage({
        body: value.body,
        _from: req.user.id,
        _to: toUserId,
    });

    await message.save();
    sendRedisMessage(message, toUser)
    return res.status(201).send(message);
});

router.post('/test/send/:id', async (req, res) => {
    const toUserId = req.params.id;

    // const toUser = await User.findById(toUserId);
    // if (!toUser) return res.status(404).send("User not found");

    const { value, error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const message = new UserMessage({
        body: value.body,
        _from: 'from',
        _to: toUserId,
    });

    // await message.save();
    sendRedisMessage(message, toUserId)
    return res.status(201).send(message);
});

router.get('/unread', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    const messages = await UserMessage.find({ _to: req.user.id });

    messages.forEach(x => {
        x.status = 'delivered'
        x.save();
    })

    return res.status(200).send(messages);
});

router.get('/chat/:id', [auth, validObjectId('id')], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    console.log(`from ${user._id} to ${req.user.id}`)

    const messages = await UserMessage
        .find({ _from: user._id, _to: req.user.id })

    messages.forEach(x => {
        x.status = 'delivered'
        x.save();
    })

    return res.status(200).send(messages);
});




module.exports = router;