## How to look at Request and Response in Bixby Studio Debugger

When there is a problem with your capsule and something didn't work right, trying opening the
debugger and look at the function you called for the action. Expand the Function in the debugger and
look at the request and repsonse bodies to see if your REST api worked as intended.

## How to look at logs on AWS CloudWatch for your Lambda

When you get a properly formatted response from the lambda but it isn't what you expect you might need to look
at the [AWS CloudWatch](https://console.aws.amazon.com/cloudwatch) and click on `Logs` to figure out what is going on
with the lambda function.

## Maintain Your Capsule Memory and Throughput

A couple of things to watch for:
- watch for the need to enlarge memory allocation
- watch for the need to increase db throughput

## Iterating while your Capsule is in Production

How to iterate on your capsule in production:
- cut a release of the lambda to a stable version
- set the `prod` alias on your lambda to point this stable version
- place a new server version in the lambda code
- deploy a new version of the lambda (this will be `LATEST` and your `dev` environment) 
- test with the Simulator and debugger to make sure you are using dev 

## How to rotate your secretClientApiKey

You secret client api key should never appear in any logs or outside secure environments. If it does, you should
change it immediately:
- change your lambda environment variable `secretClientApi` key
- change your `dev` and `prod` secrets for `secretClientApi` in Bixby Developer Center

If you do this at the same moment (or as quickly together as possible), the down-time for your capsule will be minimal.
The next time a capsule runs, it will use the new keys in both places.

## How to Test Lambda Code Locally

It is possible to run your lambda code locally, and testing on the command line before deploying it to the cloud.
The index.js script can be imported into another JavaScript file, and you can run that other file
from the command line. Try passing events from it to the exported `handler` in the `index.js` file.

[Return to README](../README.md)
