## Create your DynamoDB tables

You'll need to start by creating a table for storing memories for the example capsule. Take the following steps:
- log into the AWS Management Console and go to the [AWS DynamoDB Dashboard](https://console.aws.amazon.com/dynamodb)
- look for the `Create table` button and click on it
- you should see the Create DynamoDB table page (pictured below), you'll be entering something at each red arrow, please pay close attention to upper and lower case letters, because everything is case-sensitive
- enter `memories` for the Table name
- enter `userId` for the Primary Partition key
- check the `Add sort key` checkbox (which will reveal the sort key field)
- enter `whenStored` for the sort key
- choose `Number` as the type for the sort field
- leave the `Use default settings` checkbox alone (leave it checked),
- press the `Create` button, and you'll see a page that shows your table has been created

![DynamoDB Create Table Settings](dynamodb-create-table.png)

If you see an error at the last step instead, one that looks like "The AWS Access Key Id needs a subscription
for the service", it may be that your AWS account is not ready. If you haven't received that 3rd email from AWS
yet, the one that says everything is ready, you may just need to wait.

Sometimes, at this point, you might choose to use the DynamoDB console (look for the "Items" tab for your table)
to add initial data to your table for testing purposes. The sample capsule we are creating here does not require it.
The lambda code will add user ids and memories to this table automatically, as they are needed.

Next: [Initialize the Lambda](04-lambda-setup.md)
