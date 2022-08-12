const { createClient } = require('redis');

const client = createClient({
    url: 'redis://redis-15371.c264.ap-south-1-1.ec2.cloud.redislabs.com:15371',
    password: '5B5ANRcBoGPw8QpiMVUNk4MwsQ766q0O'
});

module.exports.connectClient = () => {
    client.on('error', (err) => console.log('Redis Client Error', err));

    client.connect().then(val => {
        console.log('Redis client connected');
    }).catch(erro => {
        console.log('Could not connect to redis client')
    })

    client.publish('channel', 'this message is being sent from redis-nodejs');
}

module.exports.publishMessage = async (message, channel) => {
    message = JSON.stringify(message);
    return client.publish(channel, message);
}

