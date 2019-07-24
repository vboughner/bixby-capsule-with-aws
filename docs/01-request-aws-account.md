## Request an AWS account

You'll be using the following Amazon Web Services: DynamoDB, Lambda, API Gateway, CloudWatch (for logs).

If you don't already have an AWS account, you'll need to request one 24 hours before you need it, to allow
time for it to finish setting up. Trying to use the DynamoDB, before the waiting period passes can
lead to unexpected errors.

Here's how to request an account:
- go to [Amazon Web Services (AWS)](https://aws.amazon.com/) and click on `Create an AWS Account`
- enter your email address, choose a password, pick an account name, and press `Continue`
- enter account type, phone number, address, and press `Create Account and Continue`
- submit your credit card information (you won't be charged unless you exceed free tier limits)
- enter your mobile phone number (they send you a text), and press `Send SMS`
- look at your phone and copy the 4-digit verification code into the next screen
- select the `Basic Plan`, which is free
- in a few minutes when your account is activated, you'll receive an email
- use information from the email to [sign into the root console](https://console.aws.amazon.com/)

It is recommended that you use your root console access to
[create an IAM identity](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
for yourself, and log in with that regularly, instead of using the root console. It provides better security and
allows you to add people to your team, and give them tailored access.

## Command Line access to AWS

You'll need to set up your command-line access to AWS services:
- configure your AWS identity on the command line
- install the npm packages you need for AWS command line interface

