#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
const { Buffer } = require('buffer');

// connect to RabbitMQ server
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        console.log(error0)
        throw error0;
    }

    // create channel, where most of the API for getting things done resides
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'hello';

        // previously we declared queue as 'hello', hence the channel name will be hello
        channel.assertQueue(queue, {
            durable: false // if true, queue will survive broker restarts, else if false it wont
        })

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue)

        channel.consume(queue, (msg) => {
            console.log(" [x] Received %s", msg.content.toString())
        }, {
            noAck: true
        })
    });
})