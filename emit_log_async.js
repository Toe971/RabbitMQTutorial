#!/usr/bin/env node
//$ In the previous tutorial we created a work queue. The assumption behind a work queue is that each task is delivered to exactly one worker. In this part we'll do something completely different -- we'll deliver a message to multiple consumers. This pattern is known as "publish/subscribe".

//$ To illustrate the pattern, we're going to build a simple logging system. It will consist of two programs -- the first will emit log messages and the second will receive and print them.

//$ In our logging system every running copy of the receiver program will get the messages. That way we'll be able to run one receiver and direct the logs to disk; and at the same time we'll be able to run another receiver and see the logs on the screen.

//$ Essentially, published log messages are going to be broadcast to all the receivers.

const amqp = require('amqplib');
const { Buffer } = require('buffer');

//$ Variables

const exchange = 'logs'

const msg = process.argv.slice(2).join(' ') || 'Hello World'

// connect to RabbitMQ server
const main = async () => {
    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()

    // declare exchange, publishing to a non-exisiting exchange is forbidden
    await channel.assertExchange(exchange, 'fanout', {
        durable: false
    })

    
    channel.publish(exchange, '', Buffer.from(msg))

    console.log(` [x] Sent ${msg}`)

    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
}

main().catch(console.warn);

  