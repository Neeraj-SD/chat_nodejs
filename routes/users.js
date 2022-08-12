const express = require('express')
const router = express.Router()

const messages = require('./messages');

router.use('/messages', messages);

const { User, validate: validateUser } = require('../models/user');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

router.get('/', auth, async (req, res) => {
    const user = await User
        .findById(req.user.id)
        .populate('interests avatar campus');
    if (!user) res.status(404).send('User not found');

    res.status(200).send(await user.getAnonymousUser())

});

router.get('/:id', [auth, validObjectId('id')], async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) res.status(404).send('User not found');
    // await user.populate('avatar');

    res.status(200).send(await user.getAnonymousUser())
});

//TODO: Update profile
router.put('/', auth, async (req, res) => {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) res.status(404).send('User not found');

})

module.exports = router;