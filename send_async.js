#!/usr/bin/env node

const amqp = require('amqplib');
// tutorial uses amqplib/callback_api, as we are using async await and promises dont use the /callback_api
const { Buffer } = require('buffer');

// connect to RabbitMQ server
const main = async () => {
    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()

    const queue = 'hello'
    const msg = 'Hello World'

    // send and receive both have assertQueue as it is possible that either send or receive might start first
    // as assertQueue is idempotent, we do not need to worry about repeated instances of assertQueue
    await channel.assertQueue(queue, {
        durable: false
    })

    // from documentation, no need to use await for sendToQueue, makes sense as we do not need to 
    channel.sendToQueue(queue, Buffer.from(msg))
    console.log(` [x] Sent ${msg}`)

    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
}

main().catch(console.warn);

  