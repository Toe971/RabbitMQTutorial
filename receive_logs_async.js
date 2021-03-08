#!/usr/bin/env node

const amqp = require('amqplib');

const exchange = 'logs'

// connect to RabbitMQ server
const main = async () => {
    // create connection
    const conn = await amqp.connect('amqp://localhost')

    // create channel
    const channel = await conn.createChannel()

    

    await channel.assertExchange(exchange, 'fanout', {
        durable: false
    })

    // when queue parameter is declared as an empty string, RabbitMQ will automatically generate a name for the queue
    // exclusive: true means that after the connection that declared it closes, the q will be deleted as it is exclusive
    const q = await channel.assertQueue('', {
        exclusive: true
    })

    console.log(`q = ${q}, q.queue = ${q.queue}`)

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`)

    const msgHandler = msg => {
        const date = new Date()
        console.log(`[x] Log: ${date} ${msg.content.toString()}`)
    }

    await channel.consume(q.queue, msgHandler, {
        noAck: false
    })
}

main().catch(console.warn)