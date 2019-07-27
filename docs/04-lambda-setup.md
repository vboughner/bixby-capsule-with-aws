## Create the Lambda

The AWS Lambda is where all of your back-end code runs, follow these steps to set it up for the sample capsule:
- got to [Lambda Dashboard](https://console.aws.amazon.com/lambda) in the AWS Management Console
- look for an orange button that says `Create function` and click on it
- enter the name of the function `memory-lambda` (see image below, note that this name needs to match the lambda name in the `deploy.sh` script you are using later)
- press the orange `Create` button

![Create Lambda Function](create-function.png)

Once the lambda function is created, it has some Hello World code in it (we'll replace this code in a later step).
Try out a test:
- press the `Test` near the top to try it out
- choose any name for the new test event
- press the orange `Create` button at the bottom of the dialog window
- press the `Test` button near the top again, and this time it will run the lambda
- click on the triange next to `Details` to see all the results (see image below)

![Successful Lambda Test](successful-lambda-test.png)

## Add Permission to access DynamoDB

Your lambda is going to need permission to access the DynamoDB table you created. Follow these steps
to enable it to access whatever database tables you create:
- on the Lambda function page you've been using, scroll down to the `Execution Role` section
- click on the link for viewing this lambda's execution role (see image below) 

![Execution Role](execution-role.png)

- when the role is displayed, look for the blue `Attach policies` button and click on it
- when the policy list comes up, enter `dynamodb` into the search bar (see image below)
- check the box for `AmazonDynamoDBFullAccess` (you can see the different policy names by hovering over them) 
- press the `Attach` button

![Add Policy for DynamoDB](add-policy-for-dynamodb.png)

## Set up Environment Variable

Your REST api is going to need a secret client api key to guarantee that no one else accesses
your lambda and database. Follow these steps to add it to your Lambda:
- return to the lambda function page
- scroll down and look for the Environment Variable section (see image below)
- enter the name of a new environment variable: `secretClientApiKey` (case-sensitive)
- enter a unique key that is long enough to be difficult to guess, note what you used here, you'll need it again when setting up the capsule (in this example I use `my-client-key-0425-afgnrq-4fe6h1`)
- press the orange `Save` button for the lambda

![Lambda Environment Variable](lambda-env-variable.png)

## Deploy New Lambda Code

This tutorial repository has everything you need to compile and deploy new code
to the AWS Lambda that you've just created. Follow these steps to install the sample capsule lambda code:
- make sure you have npm and node installed already (here is [more information about this](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- make sure you already have the right `aws` credentials configured for your command line (see the [setup for cmdline tools](01-request-aws-account.md))
- open a terminal window on your local machine and change directories to the place where you cloned this repository
- cd into the `lambda` folder
- run this command: `npm install` and wait while the various npm packages the lambda needs are downloaded
- there should be a `node_modules` directory with about 17 packages in it (these will be deployed as part of the lambda)
- run this command: `npm run deploy` (it will take a minute or two, to zip and upload about 6-7 megabytes of JavaScript)
- if it succeeds, you'll see JSON in your terminal that contains information about your lambda function
- if it fails, check the name of the lambda in the script against the name of the lambda function in the AWS management console, they need to be the same and are case-sensitive

When you return to the Lambda management console on the AWS website, you'll see that the code is no longer displayed
there because it is too large. The code there is now what was in the `lambda` folder of the repository, where
you just ran `npm run deploy`. You can update the code for this lambda again anytime by running that script. Have a look
at the `index.js` file in the `lambda` folder for the entry point.

## Increasing Lambda Memory and Timeout

Sometimes you need a longer timeout, or more memory, so you can see certain kinds of error messages from the lambda code.
If you see a timeout error for your lambda when it runs, instead of a more informative error, try this:
- look for the `Basic settings` box on the Lambda function page
- set the timeout to something longer than 3 seconds (try 10 seconds for now)
- set the memory to something greater than 128M (try 256M for now)

## Test at the Lambda

You can test the newly deployed code on the lambda function web page, like this:
- press the `Test` button at the top of your lambda function page to run your Hello World test again (from earlier)
- it should run successfully and details will include a response that looks like this:
```js
{
  "success": false,
  "errorCode": 1001,
  "errorMessage": "missing body-json field"
}
``` 

The input event isn't yet formatted the way our `index.js` file expects to see it.
Let's make that test work better:
- look for a dropdown menu next to the `Test` button 
- pull down the menu and select `Configure test events`
- in the window that appears, change the JSON for the hello world test to the following (replacing what comes after `secretClientApiKey` with your own secret key):
```js
{
  "body-json": {
    "secretClientApiKey": "my-client-key-0425-afgnrq-4fe6h1",
    "clientVersion": "1.0.0",
    "userId": "my-unique-user-001",
    "actionType": "list"
  }
}
```

![Test Event Input](test-event-input.png)

This time when you press `Test` again, you should see output like this:
```js
{
  "answers": [],
  "success": true,
  "speech": "There are no memories.",
  "serverVersion": "1.0.0"
}
```

Later, when we have the API Gateway working, we'll test like this again, using a tool called Postman.
And the REST api should work just like this, with a similar body in the POST request.

Next: [Configure the API Gateway](05-api-gateway-setup.md)
