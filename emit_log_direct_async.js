#!/usr/bin/env node


const amqp = require('amqplib');
const { Buffer } = require('buffer');

//$ Variables

const exchange = 'direct_logs'
const args = process.argv.slice(2)
console.log(args)
const msg = args.slice(1).join(' ') || 'Hello World'

// connect to RabbitMQ server
const main = async () => {
    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()
    const severity = (args.length > 0) ? args[0] : 'info'

    

    
    channel.publish(exchange, severity, Buffer.from(msg))

    console.log(` [x] Sent ${severity}: ${msg}`)

    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
}

main().catch(console.warn);

  