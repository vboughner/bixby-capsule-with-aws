TODO: fill out more of these instructions with screenshots

## How to look at Request and Response in Bixby Studio Debugger

- open the debugger after trying something in the Simulator that didn't work right

## How to look at logs on AWS CloudWatch for your Lambda

When you get a properly formatted response from the lambda but it isn't what you expect you might need to look
at the AWS CloudWatch logs to figure out what is going on.

## Maintain Your Capsule Memory and Throughput

- watch for the need to enlarge memory allocation
- watch for the need to increase db throughput

## Iterating while your Capsule is in Production

- cut a release of the lambda to a stable version
- set the `prod` alias on your lambda to point this stable version
- place a new server version in the lambda code
- deploy a new version of the lambda (this will be `LATEST` and your `dev` environment) 
- test with the Simulator and debugger to make sure you are using dev 

## How to rotate your secretClientApiKey

- change it in your lambda environment variable and in Bixby Developer Center at the same moment
- the next time a capsule runs it will use the new key

## How to Test Lambda Code Locally

It is possible to run your lambda code locally by adding a few things designed for testing
on the command line.

TODO: place example cmdline.js file into the repo

[Return to README](../README.md)
