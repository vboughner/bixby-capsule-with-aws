TODO: fill out more of these instructions with screenshots

## Maintain Your Capsule Memory and Throughput

- how to look at the CloudWatch logs
- watch for the need to enlarge memory allocation
- watch for the need to increase db throughput
- how to rotate your secretClientApiKey

## Iterating while your Capsule is in Production

- cut a release of the lambda to a stable version
- set the `prod` alias on your lambda to point this stable version
- place a new server version in the lambda code
- deploy a new version of the lambda (this will be `LATEST` and your `dev` environment) 
- test with the Simulator and debugger to make sure you are using dev 

## How to Test Lambda Code Locally

It is possible to run your lambda code locally by adding a few things designed for testing
on the command line.

TODO: place example cmdline.js file into the repo

[Return to README](../README.md)
