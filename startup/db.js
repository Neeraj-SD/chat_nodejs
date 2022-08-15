const mongoose = require('mongoose');
const config = require('config');


module.exports = async function () {
    let conStr = config.get('dbConnectionString');
    conStr = conStr.replace('<username>', config.get('mongoPass.username'));
    conStr = conStr.replace('<password>', config.get('mongoPass.password'));

    // const conStr = "mongodb://127.0.0.1:27017/test"

    const db = await mongoose.connect(conStr, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to database...'));
}