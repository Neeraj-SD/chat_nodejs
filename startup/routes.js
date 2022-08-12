const auth = require('../routes/auth')
const groups = require('../routes/groups')
const questions = require('../routes/questions')
const users = require('../routes/users')

module.exports = function(app){
    app.use('/api/auth', auth);
    app.use('/api/groups', groups);
    app.use('/api/questions', questions);
    app.use('/api/users', users);
}