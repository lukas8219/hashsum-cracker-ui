# HashSum Cracker

We are distributing a CPU intensive task into multiple nodes and making it horizontally scale depending on the quantity of messages on a queue.

The UI should:
- Be able to monitor each Hash being cracked at real-time.
- Be able to know much workers are being used for each processing hash
- Be able to list all cracked Hashs

The Backend should:
- Horizontally scale depending on the amount of pending messages on the queue
- Keep a State Machine from each step on the pipeline for the Hash.
- Being able to properly route messages without overloading RabbitMQ with many queues.

# Solution 1

- Create 85(or N) queues.
- One for each possible character on the alphabet. 26 alpha m 26 aplha M 33 special
- Distribute message depending on the index from the alphabet;
    - Exchange with routing. Thus we can scale to N queues for each character
- A worker for each combination queue+alphabet;
- Scale the worker based on N of messages

## Problem #1
How to stop zillons of pending messages getting queued?
- Adding a DB-based queue as a mediator.
- This will track hashSum requests, status and stop all pending messages. 

## Problem 2
How to track all the workers involved?
Use Redis; :LOL:

# Models

## Alphabets

Hardcoded entries containg the alphabet being used tracked by ID;

- 1, abcdz....
- 2, abcdz..ABcdz...
- 3, abcd...ABCD...0-9
- 4, abcd...ABCD...0-9...!@#$%%...

## HashSumMessages
Table containing the message to be processed.

columns
hashsum_id

SELECT * FROM hash_sum_messages JOIN hash_sum as hs ON hs.id = hashsum_id AND hs.finishedAt != NULL;

## HashSum
Columns

hashsum
alphabet_id
result
attempts
variations
requested_at
finished_at