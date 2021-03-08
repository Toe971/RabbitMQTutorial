#!/usr/bin/env node

const amqp = require('amqplib');
const { Buffer } = require('buffer');

// connect to RabbitMQ server
const main = async () => {
    // create connection
    const conn = await amqp.connect('amqp://localhost')

    // create channel
    const channel = await conn.createChannel()

    const queue = 'hello'

    await channel.assertQueue(queue, {
        durable: false
    })

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`)

    channel.consume(queue, (msg) => {
        console.log(`[x] Received ${msg.content.toString()}`)
    }, {
        noAck: true
    })
}

main().catch(console.warn)