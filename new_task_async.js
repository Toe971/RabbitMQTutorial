#!/usr/bin/env node

//$ The main idea behind Work Queues (aka: Task Queues) is to avoid doing a resource-intensive task immediately and having to wait for it to complete. Instead we schedule the task to be done later. We encapsulate a task as a message and send it to a queue. A worker process running in the background will pop the tasks and eventually execute the job. When you run many workers the tasks will be shared between them.
//$ This concept is especially useful in web applications where it's impossible to handle a complex task during a short HTTP request window.

const amqp = require('amqplib');
// tutorial uses amqplib/callback_api, as we are using async await and promises dont use the /callback_api
const { Buffer } = require('buffer');

//$ Variables

const queue = 'task_queue'
// See documentation at https://nodejs.org/docs/latest/api/process.html#process_process_argv
// Index 0/first element will be process.execPath, e.g. '/usr/local/bin/node', Index 1/second element will be path to the JS file being executed e.g.  /Users/mjr/work/node/process-args.js, Index 2/ third element and onwards will be command line arguments passed in 
const msg = process.argv.slice(2).join(' ') || 'Hello World'

// connect to RabbitMQ server
const main = async () => {
    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()



    // send and receive both have assertQueue as it is possible that either send or receive might start first, hence need to delcare queue first
    // as assertQueue is idempotent, we do not need to worry about repeated instances of assertQueue
    await channel.assertQueue(queue, {
        durable: true // queue will survive broker restarts
    })

    // from documentation, no need to use await for sendToQueue, makes sense as we do not need to 
    channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true // if true, the message will survive broker restarts provided it is in a queue that that also survives restarts
    })
    console.log(` [x] Sent ${msg}`)

    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
}

main().catch(console.warn);

  