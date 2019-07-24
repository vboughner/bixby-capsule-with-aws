## Design the Conversation

Take some time to design the conversational user interface:
- figure out what features you want your capsule to have
- design the conversation your capsule will engage in
- decide how you can use named-dispatch to your advantage

This small effort up-front will be a big help in making many of the decisions that are coming.
See the [Bixby Developer Center - Design Guides](https://bixbydevelopers.com/dev/docs/dev-guide/design-guides)
for more help with capsule design.

## Delegate between Lambda and Capsule

You'll need to determine where the work should happen, I suggest:
- storage and computation in the cloud (AWS)
- user interface and localization in the capsule (Bixby)

When originally designing My Brain capsule, I tried to place almost everything in the cloud.
Later I realized that there is a great deal of help in Bixby for handling interaction and dialog that
needs to be different under various circumstances (singular or plural responses, for example).

At the same time, if you find yourself writing a lot JavaScript code in the capsule to handle some problem,
it's best to move that work in the cloud. The AWS Lambda lets you use Node 10, with modern JavaScript language,
and you'll have convenient access to the data your capsule stores.

## Plan for your Data Storage

The AWS DynamoDB is a NoSQL database, and can store JavaScript objects (which are described with JSON).
That's convenient for our purposes, because they are easy to use in JavaScript code, useful
on the cloud, over the REST api, and within the capsule.

You may create an arbitrary number of tables. Each row in the table should have one or two keys that together
uniquely identify the row. When you retrieve that row, it comes to you as a JavaScript object that contains everything
in the row.

My Brain capsule uses a single table to store all of the memories. The primary key
is the unique user id that comes from the
[capsule's $vivContext](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.js-actions#passing-user-context-information).
The secondary sort key is the timestamp when
a memory was created. Together those keys uniquely define each row in the table, and there is one memory stored in
each row.

So, I suggest you plan ahead for your data storage needs:
- decide what will need to be stored
- figure out how it will need to be accessed
- design the tables and keys for efficiency of throughput

For performance reasons, it's best if what you need from the table can be retrieved using a single
query, rather than scanning your entire table, see
[Best Practices for Querying and Scanning Data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html).

## Design a Simple API

The API for communicating between the capsule and the cloud suggested here uses HTTPS and REST.
It’s not really a complete REST api in the traditional sense. It's used here as a convenient and secure
way to direct remote invocation. The use of a single POST endpoint allows us to have a secret client api key
that is encrypted while in transit, and that won't be stored in plain text in the server logs, like the parameters of
a GET request commonly are. 

Take a moment to write some JSON that describes:
- what must be in every request (action type and arguments, secretClientApiKey, clientVersion, etc.)
- what will be in every response (success flag / error messages, serverVersion, query results, etc.)

Next: [Set up the Database](03-database-setup.md)
