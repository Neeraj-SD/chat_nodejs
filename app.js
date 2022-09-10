const express = require('express');
const config = require('config')

const { instrument } = require("@socket.io/admin-ui");

const jwt = require('jsonwebtoken')

const app = express();
app.use(express.json());

const { Message, validate } = require('./models/message');


const http = require('http');
// const server = http.createServer(app);
const { Server } = require("socket.io");


require('./startup/routes')(app);
require('./startup/db')();
const firebase_configuration = require('./startup/firebase-configuration');
const { User } = require('./models/user');
// require('./startup/redis-client').connectClient();

const registerMessageHandlers = require('./event_handlers/message_handler')
const onConnectionHandlers = require('./event_handlers/onconnection_handler')

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR JWT PRIVATE KEY IS NOT DEFINED')
    process.exit(1)
}

const PORT = process.env.PORT || 3001;

// const server = app.listen(PORT, () => console.log("Listening on port " + PORT));



const server = app.listen(PORT, () => console.log("Listening on port " + PORT));

const io = new Server(server, {
    cors: {
        origin: "https://admin.socket.io"
    }
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    console.log(token)
    if (token) {
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
            console.log(decoded)
            socket.user = decoded
            next()
        }
        catch (ex) {
            next(new Error('Invalid token.'))
        }
    }
    else {
        next(new Error('Invalid token.'))

    }
})

const onConnection = (socket) => {
    registerMessageHandlers(io, socket)
}

io.on('connection', async (socket) => {
    // let user = await User.findOne(socket.user)
    // user.socket_id = socket.id;
    // await user.save()

    console.log('a user connected', socket.id);
    socket.on('msg', (_) => console.log(_ + socket.id))

    socket.on('create', async (user_id, callback) => {
        let user = await User.findById(user_id)
        user.socket_id = socket.id;
        await user.save()

        console.log('create Value: ', user.id, user.socket_id)
        callback({
            status: "ok"
        });
    })


    onConnection(socket)
});

instrument(io, {
    auth: false
});

// io.on('disconnection', socket => console.log('Disconnected'))


module.exports = server;