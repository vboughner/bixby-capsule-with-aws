## Set up an API Gateway

You have a database now, and you've got a lambda, you'll need access to these from the outside. You'll build an
AWS API Gateway. This will expose a REST api to the outside that anyone can reach, if they know the url. In this
tutorial you'll secure it with a secret client api key, so it will only respond to you. Everyone else gets
an error if they try to use it.

Also, we're going to create 2 different "stages" for your API Gateway, one called `dev` and one called `prod`. This will
allow the API Gateway to execute a different version of your lambda function, depending on which url is used, as the
dev and prod urls will be a little different. You'll use the `dev` and `prod` aliases you set up for your lambda in
the last page of instructions.

Having two different "stages" like this means that you can assign a stable version of your lambda for use in
production, on user's devices after your capsule has been released to the marketplace. And you'll still be able to 
continue to work on bug fixes and improvements, in newer versions of your lambda and Bixby Studio using the `dev` url,
without disturbing current users.

## Creating an API Gateway Service

Here's how to create your API Gateway service:
- go the [API Gateway Service](https://console.aws.amazon.com/apigateway)
- press the blue `Create API` button
- in the page that follows, enter an API name, like `memory-api` (see image below)
- press the `Create API` button

![Create Api 1](create-api-1.png)

You need to create the top-level resource for your api:
- pull down the `Actions` menu and choose `Create Resource`
- enter a resource name and resource path (use `service` for both)
- press the `Create resource` button

![Create Api 2](create-api-2.png)

![Create Api 3](create-api-3.png)

Now create a POST method on this resources:
- pull down the `Actions` menu and choose `Create method`
- choose POST from the menu that appears
- enter the name of the lambda function, as `memory-lambda`
- press the `Save` button
- press `Ok` when a popup window asks you about providing access to the lambda function

![Create Api 4](create-api-4.png)

![Create Api 5](create-api-5.png)

![Create Api 6](create-api-6.png)

## Organizing the Incoming JSON Data

You'll need the API to accept JSON data, follow these steps to create a mapping:
- after the last step, you should be at the service POST page (see image below)
- click on the `Integration Request` link

![Map the API 1](mapping-api-1.png)

- scroll down until you can see `Mapping Templates` (see image below)
- click on the triangle to expand this section
- click on the + button to add a mapping template

![Map the API 2](mapping-api-2.png)

- enter `application/json` into the content-type field
- press the checkmark button

![Map the API 3](mapping-api-3.png)

- when a popup comes through about changing passthrough behavior, press the `Yes, secure this integration` button

![Map the API 4](mapping-api-4.png)

- scroll down further so you can see the generate template dropdown menu
- choose `Method Request passthru` from the menu

![Map the API 5](mapping-api-5.png)

- once the code fills into the window, press the `Save` button 

![Map the API 6](mapping-api-6.png)

- return to the POST method page once again by clicking on the `Method Execution` link

![Map the API 7](mapping-api-7.png)

## Setting up the Dev and Prod Stages

TODO: try out this section and make sure how it works

- add the environment variable for stage
- deploy the 2 different stages

## Test your API with Postman

- download and install Postman
- create a basic REST POST query that will work
- save it and test with it


For more information about all of this, see these excellent articles:
- [Full Guide to developing REST API’s with AWS API Gateway and AWS Lambda](https://blog.sourcerer.io/full-guide-to-developing-rest-apis-with-aws-api-gateway-and-aws-lambda-d254729d6992)
- [Managing In-Production AWS Lambda Functions with API Gateway](https://medium.com/@zeebaig/managing-in-production-aws-lambda-functions-with-api-gateway-3921266ed7c6)

Next: [Create and Publish the Capsule](06-capsule-creation.md)
