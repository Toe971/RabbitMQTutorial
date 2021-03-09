#!/usr/bin/env node


const amqp = require('amqplib');
const { Buffer } = require('buffer');

//$ Variables

const exchange = 'topic_logs'
const args = process.argv.slice(2)
console.log(args)
// routing key, shape is '<facility>.<severity>'
const key = (args.length > 0) ? args[0] : 'anonymous.info'
const msg = args.slice(1).join(' ') || 'Hello World'

// connect to RabbitMQ server
const main = async () => {
    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()

    // in receive_logs_topic_async.js, the queue is declared there
    // hence start receive_logs_topic_async.js
    // declare exchange, publishing to a non-exisiting exchange is forbidden
    await channel.assertExchange(exchange, 'topic', {
        durable: false
    })

    
    channel.publish(exchange, key, Buffer.from(msg))

    console.log(` [x] Sent ${key}: ${msg}`)

    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
}

main().catch(console.warn);

  