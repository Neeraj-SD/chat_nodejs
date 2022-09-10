const { Message } = require('../models/message')
const { User } = require('../models/user')

module.exports = (io, socket) => {
    const sendMessage = async (payload, callback) => {
        payload = JSON.parse(payload)
        console.log(payload)

        const message = new Message({
            body: payload.body,
            _from: socket.user.id,
            _to: payload.to,
        })

        await message.save();

        const user = await User.findById(payload.to)

        const result = await io.to(user.socket_id).emit('chat', message)
        console.log(message.toJSON())

        callback(message)
    }


    const deliveredChat = async (chatId, callback) => {
        const chat = await Message.findById(chatId)
        await chat.delete();
    }

    const unread = async (_, callback) => {
        const chats = await Message.find({ _to: socket.user.id }).all()

        console.log(chats.length)

        const user = await User.findById(socket.user.id)
        console.log('chat:unread' + user.email + chats);

        chats.map(chat => console.log(chat))

        chats.map(async chat => await io.to(user.socket_id).emit('chat', chat))
    }

    socket.on('send-chat', sendMessage)
    socket.on('chat:delivered', deliveredChat)
    socket.on('chat:unread', unread)
}