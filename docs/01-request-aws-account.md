## Request an AWS account

You'll be using the following Amazon Web Services: DynamoDB, Lambda, API Gateway, and CloudWatch (for logs).

If you don't already have an AWS account, you'll need to request one 24 hours before you need it, to allow
time for it to finish setting up. You'll also need your own AWS credentials, and the AWS command line tools.
That's something you can set up immediately, without waiting.

If you try to access DynamoDB or Lambda early, you may see a web page that says
"Your service sign-up is almost complete". That's normal, and you are likely still in the waiting period.
No action is required, and when the waiting period is over, you'll receive another email. I received mine after 24 hours.

Here's how to request an account:
- go to [Amazon Web Services (AWS)](https://aws.amazon.com/) and click on `Create an AWS Account`
- enter your email address, choose a password, pick an account name, and press `Continue`
- enter account type, phone number, address, and press `Create Account and Continue`
- submit your credit card information (you won't be charged, unless you exceed free tier limits)
- enter your mobile phone number (they what to send you a text), and press `Send SMS`
- look at your phone and type the 4-digit verification code into the next screen
- select the `Basic Plan`, which is free
- use the email address and password you gave above to [sign into the root console](https://console.aws.amazon.com/)
- in a few minutes, you'll receive an email acknowledging your activation

## Set up Identity and Access Management

It is recommended that you use your root console access only to
[create an IAM identity](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
for yourself, and log in with the IAM identity on a regular basis, instead of using the root console. It provides
better security management and allows you to add people to your team, and give them tailored access. Here's how:
- from AWS Management Console, type `IAM` in the Find Services search, go to [Identity and Access Management](https://console.aws.amazon.com/iam/home)
- look for `Users` in the left sidebar and click on it (and that should take you [here](https://console.aws.amazon.com/iam/home?#/users))
- press the blue `Add user` button at the top
- enter a user name, for the developer account you wish to create for yourself
- check both the programmatic and console access checkboxes, and enter a password for your use (or optionally, generate one)
- press the  `Next: Persmission` button
- on the Set permissions page, press the `Create group` button
- in the create group dialog, choose a group name (like "developer")
- use the filter for policies to find and check the boxes for the following policies: Administrator Access, AmazonDynamoDBFullAccess, AWSLambdaFullAccess, AWSLambdaInvocation-DynamoDB, AmazonAPIGatewayAdministator, CloudWatchFullAccess 
- press the `Create Group` button, and should show that your new user will be in the group
- press the `Next: Tags` button
- no need to add anything on the tags screen, press the `Next Review` button
- review the options displayed the user you are creating, press the `Create user` button, and wait a moment...
- IMPORTANT: use the `Download .csv` button on the final screen to download your AWS credentials, you'll need them for command line tool setup (below), it's the only opportunity you have to get these credentials, put them in a safe place, somewhere under your home directory, for example
- bookmark the link that follows "Users with AWS Management Console access can sign-in at", you'll need it
- remember the user name and password displayed on this screen, for when you log in using that console access link
- that link, your IAM user name, and the password are also listed in the `.csv` file that you downloaded

## Set up Command Line Tools

You need command-line access to deploy code to your lambda and get access the database. Here's how to set it up: 
- install the AWS command line tools, either by following [these directions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), or...
- if you have `homebrew` on MacOS you may use `brew install awscli` (according to [this Medium article](https://medium.com/@yogeshdarji99/steps-to-install-awscli-on-mac-5bad783483a)) 
- get your AWS credentials (look in the `.csv` file that you downloaded when setting up IAM above)
- note your "Access key ID" and "Secret access key" in the 3rd and 4th columns, on the second row of that `.csv` file
- configure your AWS identity by typing `aws configure`
- when prompted, enter the "Access key ID" and "Secret access key" from the `.csv` file
- for default region name, leave it as `us-east-1`
- for default output format, leave is as `json`

You'll notice that the `aws configure` command created a couple of new files in your `~/.aws` folder,
called `config` and `credentials`. When you have more than one AWS account, it is useful to create copies of those
credential files and place them into sub-folders, making it easy to switch credentials by copying and overwriting
the `config` and `credentials` files.   

## Look at AWS Management Console

The AWS Management Console is useful for configuring the database and the lambda.
You'll need the console access link you received above, when you were setting up IAM, as well as the
user name and password for that IAM user you created.

You can use the Find Services search bar to look for the services you need: DynamoDB, Lambda, CloudWatch,
and API Gateway. Those pages are where you will configure these services in the instructions that follow.

Next: [Design and Plan](02-design-and-plan.md)
