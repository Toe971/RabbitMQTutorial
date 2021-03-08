#!/usr/bin/env node

const amqp = require('amqplib');
const { Buffer } = require('buffer');

const queue = 'task_queue'

// connect to RabbitMQ server
const main = async () => {
    // create connection
    const conn = await amqp.connect('amqp://localhost')

    // create channel
    const channel = await conn.createChannel()

    

    await channel.assertQueue(queue, {
        durable: true // ensures that queue survives broker restarts
    })

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`)

    const msgHandler = msg => {
        const secs = msg.content.toString().split(' ').length - 1
        console.log(secs)
        console.log(`[x] Received ${msg.content.toString()}`)
        setTimeout(() => {
            console.log(" [x] Done")
        }, secs * 1000)
    }

    // sets up a consumer with a callback to be invoked with each message, something like express middleware
    await channel.consume(queue, msgHandler, {
        noAck: false
    })
}

main().catch(console.warn)