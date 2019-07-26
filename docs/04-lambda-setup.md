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
- enter a unique key that is long enough to be difficult to guess, note what you used here, you'll need it again when setting up the capsule
- press the orange `Save` button for the lambda

![Lambda Environment Variable](lambda-env-variable.png)

## Deploy New Lambda Code

This tutorial repository has everything you need to compile and deploy new code
to the AWS Lambda that you've just created. Follow these steps to install the sample capsule lambda code:
- make sure you have npm and node installed already (here is [more information about this](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- open a terminal window on your local machine and change directories to the place where you cloned this repository
- cd into the `lambda` folder
- run this command: `npm install` and wait while the various npm packages that our lambda needs are downloaded
- there should now be a `node_modules` directory with about 17 packages in it (these will become part of the lambda)
- run this command: `npm run deploy`


- deploy code from local to the Lambda

## Test at the Lambda

- run a simple test at the Lambda

Next: [Configure the API Gateway](05-api-gateway-setup.md)
