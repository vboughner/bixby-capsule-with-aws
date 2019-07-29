## Request an AWS account

You'll be using the following Amazon Web Services: DynamoDB, Lambda, API Gateway, and CloudWatch (for logs).

If you don't already have an AWS account, you'll need to request one 24 hours before you need it, to allow
time for it to finish setting up. You'll also need your own AWS credentials, and the AWS command line tools.
That's something you can set up immediately, without waiting.

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

If you try to access DynamoDB or Lambda immediately, you may see a web page that says
"Your service sign-up is almost complete". That's normal during the first 24 hours when you are likely still in the
waiting period. No action is required, when the waiting period is over, you'll receive another email that has the
subject line "Your AWS Account is Ready - Get Started Now". I received mine after about 24 hours, the first time.

Recently however, I had not received that email after 3 days. So I pressed the `Contact Support` button in the
Lambda service page. It lead me to a page called
[How do I create and activate a new Amazon Web Services account?](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
with a number of suggestions. Surprisingly, the suggestion that worked for me was to try logging in with a different
browser. When I tried to log in again with Firefox, things started working. And when I went back to using chrome they
continued to work. I received that email a few hours later.

## Set up Identity and Access Management

There are two kinds of identity for logging into the AWS Management Console. The first is the
root console login, which requires the email address and password that you signed up with, and you've got that kind of
access now, if you followed the procedure above. The other is IAM access. That's a new user account that you create on
your account, with the Identity Access Management system. You can create any number of identities like that on your
account. When you login with IAM, you use the IAM login page, and it requires an account number, username, and password. 

It is recommended that use IAM accounts for regular use. So use your root console access to
[create an IAM identity](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
for yourself, and log in with the IAM identity to do your work, instead instead of using the root console. It provides
better security management, allows you to add people to your team, and give them tailored access.

You can do the IAM setup immediately, without waiting for 24 hours, here's how:
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

IAM users do not have automatic access to billing information, and you don't need it in this tutorial because you can
access it later with your root login, but if you would like to see billing info from you IAM account as well, see
[Granting Access to You Billing Information and Tools](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/grantaccess.html).

## Set up Command Line Tools

You need AWS command-line access to deploy code to your lambda and get access the database. Here's how to set it up: 
- install the AWS command line tools, either by following [these directions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), or...
- if you have `homebrew` on MacOS you may use `brew install awscli` (according to [this Medium article](https://medium.com/@yogeshdarji99/steps-to-install-awscli-on-mac-5bad783483a)) 
- get your AWS credentials (look in the `.csv` file that you downloaded when setting up IAM above)
- note your "Access key ID" and "Secret access key" in the 3rd and 4th columns (on the second row of that `.csv` file)
- configure your AWS identity by typing `aws configure` on the command line
- when prompted, enter the "Access key ID" and "Secret access key" from the `.csv` file
- for default region name, leave it set at `us-east-1` (just press return)
- for default output format, leave is set at `json`

You'll notice that the `aws configure` command created new files in your `~/.aws` folder
called `config` and `credentials`. When you have more than one AWS account, it is useful to create copies of these
files and place them into sub-folders, making it easy to switch credentials by copying and overwriting
the `config` and `credentials` files whenever you need to change identities.   

## Look at AWS Management Console

The AWS Management Console is useful for configuring the database and the lambda.
You'll need the console access link you received above, when you were setting up IAM, as well as the
user name and password for that IAM user you created.

Use the Find Services search bar to look for these services: DynamoDB, Lambda, CloudWatch,
and API Gateway. Those lead to pages where you will configure these services using the instructions that follow.

Next: [Design and Plan](02-design-and-plan.md)
