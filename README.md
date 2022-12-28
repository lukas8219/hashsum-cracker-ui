#HashSum Cracker

We are distributing a CPU intensive task into multiple nodes and making it horizontally scale depending on the quantity of messages on a queue.

The UI should:
- Be able to monitor each Hash being cracked at real-time.
- Be able to know much workers are being used for each processing hash
- Be able to list all cracked Hashs

The Backend should:
- Horizontally scale depending on the amount of pending messages on the queue
- Keep a State Machine from each step on the pipeline for the Hash.
- Being able to properly route messages without overloading RabbitMQ with many queues.
