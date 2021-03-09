#!/usr/bin/env node

const amqp = require('amqplib');

const args = process.argv.slice(2)
const exchange = 'direct_logs'

if (args.length == 0) {
    console.log("Usage: receive_logs_direct_async.js [info] [warning] [error]")
    process.exit(1)
}


// connect to RabbitMQ server
const main = async () => {
    // create connection
    const conn = await amqp.connect('amqp://localhost')

    // create channel
    const channel = await conn.createChannel()

    

    await channel.assertExchange(exchange, 'direct', {
        durable: false
    })

    // when queue parameter is declared as an empty string, RabbitMQ will automatically generate a name for the queue
    // exclusive: true means that after the connection that declared it closes, the q will be deleted as it is exclusive
    const q = await channel.assertQueue('', {
        exclusive: true
    })

    console.log(`q = ${console.log(q)}, q.queue = ${q.queue}`)
    /* shape of q is: {
    queue: 'amq.gen-RfcznxAyvFkpD0hbZYrI2w',
    messageCount: 0,
    consumerCount: 0
    } */

    // bind the queue to the exchange, without this step the receiver will not show any messages from emit_log

    console.log(` [*] Waiting for logs. To exit press CTRL+C`)

    args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity)
    })

    const msgHandler = msg => {
        const date = new Date()
        console.log(`[x] Log at time: ${date}, ${msg.fields.routingKey}: ${msg.content.toString()}`)
    }

    await channel.consume(q.queue, msgHandler, {
        noAck: true
    })
}

main().catch(console.warn)