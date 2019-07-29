## Set up an API Gateway

You have a database now, and you've got a lambda, you'll need access to these from the outside. For this let's build an
AWS API Gateway. This will expose a REST api to the outside that anyone can reach, if they know the url. In this
tutorial you'll secure it with a secret client api key, so it will only respond to you. Everyone else gets
an error if they try to use it.

Also, we're going to create 2 different "stages" for your API Gateway, one called `dev` and one called `prod`. This will
allow the API Gateway to execute a different version of your lambda function, depending on which url is used (as the
dev and prod urls will be a little different). You'll use the `dev` and `prod` aliases you set up for your lambda in
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

Now create a POST method on this resource:
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

## Creating Dev and Prod Deployment Stages

Once your capsule is released, you are going to need separate development and production environments. That
allows you to work on new features without affecting current users. When you set up `memory-lambda`, you created
aliases for `dev` and `prod`. Now let's create two deployment stages in your AWS API Gateway, one for each.

Here's how:
- select the root level in your api navigation sidebar (if it's not already selected)
- pull down the `Actions` menu
- choose `Deploy API` (see image below)

![Deploy 1](deploy-1.png)

- select `[New Stage]` for the Deployment stage (see image below) 
- enter `dev` for the State name
- press the `Deploy` button

![Deploy 2](deploy-2.png)

- select the `Stage Variables` tab (see image below)
- press the `+` button next to Add Stage Variable 

![Deploy 3](deploy-3.png)

- enter the variable name `env` (see image below)
- enter the value `dev`
- press the checkbox

![Deploy 4](deploy-4.png)

- click on the `memory-api` -> `Resources` link in the sidebar
- **repeat the process above** to deploy another stage, but this time use `prod`, instead of `dev`

When you are done, you will have two deployment stages, `dev` and `prod`, and each wil have a stage environment
variable called `env` that has a value equal to the stage name.

## Make the Gateway API Dynamic

Now we'll make the API Gateway call a different version of the lambda, using an alias,
depending on which deployment stage is used. Try this:
- click on the `memory-api` -> `Resources` link in the sidebar (see image below)
- expand the api service by clicking on the triangle
- click on the `POST` operation
- click on the `Integration Request` link 

![Dynamic Lambda Call 1](dynamic-lambda-call-1.png)

- click on the pencil icon to edit the name of the lambda function that you entered earlier (see image below)

![Dynamic Lambda Call 2](dynamic-lambda-call-2.png)

- modify the name of the lambda function from `memory-lambda` to `memory-lambda:${stageVariables.env}` (see image below)
- click on the checkbox

![Dynamic Lambda Call 3](dynamic-lambda-call-3.png)

A popup window will appear, warning you that you need to give the API Gateway permission to call the lambda using both
of the new aliases. Do the following:
- copy all of the text from the pink background section into the clipboard (see image below, I've blocked out own account number)
- note the location of the new lambda function call (the red rectangle in the image below)

![Dynamic Lambda Call 4](dynamic-lambda-call-4.png)

- open a terminal window where you have cmdline AWS access configured for this account (from the AWS setup earlier)
- paste the clipboard text onto the command line
- edit the command line, replacing `${stageVariables.env}` with `dev` and press return (see image below)
- paste the clipboard text onto the command line again
- edit the command line, replacing `${stageVariables.env}` with `prod` and press return

![Dynamic Lambda Call 5](dynamic-lambda-call-5.png)

## Test that the API calls the Lambda  

You may test that the api calls the lambda properly for each stage, by taking the following steps:
- click on the `memory-api` -> `Resources` link in the sidebar (see image below)
- click in the `POST` method in the navigation sidebar
- press the `Test` link

![Test with API 1](test-with-api-1.png)

- enter `dev` for the value of the env state variable (see image below, you may use `prod` instead if you like)
- enter the following JSON into the request body:
```javascript
{
  "secretClientApiKey": "my-client-key-0425-afgnrq-4fe6h1",
  "clientVersion": "1.0.0",
  "userId": "my-unique-user-001",
  "actionType": "list"
}
```
- press the `Test` button
- after the test runs, you'll be able to to see the output on the right of the image below, the Response Body should look similar to what you saw when you tested the lambda earlier

![Test with API 2](test-with-api-2.png)

Note: the request gets wrapped in a `body-json` object by the Gateway API mapping function. That's why the code
in `index.js` looks for the request body within a `body-json` property. You may remember that When you tested from the
lambda earlier, you needed to wrap the request with a `body-json` object. You don't need to do that when testing
from the Gateway API, nor when using the new REST api from the outside.

## Find for your REST API URL

To find the url for accessing your api from outside AWS, look at the stage information:
- click on the link in the left-most navigation bar that says `Stages`
- click on `dev` or `prod`
- note that the URL is displayed at the top (I blocked out the account identifier in the image below)

![Find API Url](find-api-url.png)

To use the URL, you'll need to add a forward-slash and the name of the resource we added, which was `service`.
And it can only be called with POST. We'll test it from outside AWS, in the next section.

## Test your API with Postman

It's best to test your REST api now, to work out any bugs, before you try using it from a capsule. Try this:
- download and install [Postman](https://www.getpostman.com/downloads/)
- run Postman and click on the `Request` link in the welcome window to create a new request (see image below)

![Postman Test 1](postman-test-1.png)

- give the request a name, like `AWS Tutorial Request` (see image below)
- click on `Create Collection` and enter a collection name, like `AWS Tutorial`, and click on the checkbox
- press the `Save to AWS Tutorial` button

![Postman Test 2](postman-test-2.png)

- on the new request page, where it says `GET`, choose `POST` instead for the operation type (see image below)
- enter the URL for the Gateway API, remember to add `/service` to the URL that you copied from the Gateway API page above
- click on the `Body` tab
- under the body tab, click on `raw`
- to the right of `raw`, where it says `Text`, choose `JSON (application/json)` from the dropdown menu instead
- paste the same JSON data into this request that you used to test the Gateway API earlier:
```javascript
{
  "secretClientApiKey": "my-client-key-0425-afgnrq-4fe6h1",
  "clientVersion": "1.0.0",
  "userId": "my-unique-user-001",
  "actionType": "list"
}
```
- click on the `Save` button
- click on the `Send` button

![Postman Test 3](postman-test-3.png)

You should see results like those below:

![Postman Test 4](postman-test-4.png)

## References

For more information about all of this, see these excellent articles that explain how this works in more detail:
- [Full Guide to developing REST API’s with AWS API Gateway and AWS Lambda](https://blog.sourcerer.io/full-guide-to-developing-rest-apis-with-aws-api-gateway-and-aws-lambda-d254729d6992)
- [Managing In-Production AWS Lambda Functions with API Gateway](https://medium.com/@zeebaig/managing-in-production-aws-lambda-functions-with-api-gateway-3921266ed7c6)

Next: [Create and Publish the Capsule](06-capsule-creation.md)
