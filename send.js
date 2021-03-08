#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
// require('amqplib') instead of /callback_api if want to use promises
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
        const msg = 'Hello World';

        // previously we declared queue as 'hello', hence the channel name will be hello
        channel.assertQueue(queue, {
            durable: false // if true, queue will survive broker restarts, else if false it wont
        })

        // Buffer class (NodeJS class)is a global type for dealing with binary data directly, from documentation default encoding is utf-8
        // https://nodejs.org/api/buffer.html#buffer_class_buffer
        // The reason why we need to use Buffer is because the content argument for content (2nd argument of sendToQueue) requires a Buffer
        // The Buffer class in Node.js is designed to handle raw binary data. Each buffer corresponds to some raw memory allocated outside V8. Buffers act somewhat like arrays of integers, but aren't resizable and have a whole bunch of methods specifically for binary data.
        // from https://nodejs.org/en/knowledge/advanced/buffers/how-to-use-buffers/
        channel.sendToQueue(queue, Buffer.from(msg))
        console.log(" [x] Sent %s", msg)

        // Declaring a queue is idempotent, i.e. it will only be created if it does not exist already, hence it will not create a new queue of the same name if it exists, like a PUT request

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    });
})