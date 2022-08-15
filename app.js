const express = require('express');
const config = require('config')
const app = express();
app.use(express.json());

require('./startup/routes')(app);
require('./startup/db')();
const firebase_configuration = require('./startup/firebase-configuration');
require('./startup/redis-client').connectClient();


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR JWT PRIVATE KEY IS NOT DEFINED')
    process.exit(1)
}

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => console.log("Listening on port " + PORT));

module.exports = server;