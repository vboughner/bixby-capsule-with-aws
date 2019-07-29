## Register Capsule in the Bixby Developer Center

- request a free Samsung account (if you don't already have one)
- log into the Bixby Developer Center
- click on the `Teams & Capsule` link in the navigation sidebar
- create a new organization (if you don't already have one)
- register the memory capsule within this organization (see image below)

![Register Capsule 1](register-capsule-1.png)

![Register Capsule 2](register-capsule-2.png)

- click on the `Config & Secrets` tab for this capsule (configuration mode will be `dev`) (see image below)
- press the `+ Add` button under Configuration
- enter a `restApiUrl` key for `dev` (use the same URL as you tested with Postman) and press the `Add` button 
- press the `+ Add` button under Secrets
- enter a `secretClientApiKey` key for `dev`, and press the `Add` button
- press the `Apply` button at the top to apply all new config and secret additions (you may need to click elsewhere in the window first, to get the top apply bar to show)
- select the `Prod` toggel for configuration mode
- repeat this process for `prod`, use `prod` instead `dev` in the `restApiUrl`

![Capsule Config 1](capsule-config-1.png)

![Capsule Config 2](capsule-config-2.png)

![Capsule Config 3](capsule-config-3.png)

![Capsule Config 4](capsule-config-4.png)

![Capsule Config 5](capsule-config-5.png)

![Capsule Config 6](capsule-config-6.png)

![Capsule Config 7](capsule-config-7.png)

## Create the Capsule

- download and install Bixby Studio
- open the capsule folder that is included in this tutorial repository
- update the `capsule.bxb` file with your organization and capsule name (see image below)

![Capsule BXB](capsule-bxb.png)

## Test the Capsule

- open the Simulator in Bixby Studio
- press the `Compile` button if this capsule does not already have a compiled NL Model

Now you may enter some NL into the Simulator window, try these statements:
- remember that I parked on the third level in section B7
- tell me about where I parked
- list all memories

![Simulator Natural Language](simulator-nl.png)

## Iterate on Capsule Development

The tasks in this section continue your capsule development, by updating the provided boilerplate code with
your own ideas. Some of the tasks you would do at this stage with your own capsule are:
- work out the rest api code that differs from the sample capsule
- create concepts and actions for your capsule's unique features
- update the training, to look for the correct responses to particular phrases
- complete the JavaScript code for new actions
- write new dialogs to determine how Bixby speaks when these actions run
- write new views to determine how it Bixby looks when these actions return results

## Submit a Release to Marketplace

When you capsule is ready to be submitted to the marketplace, come back here for ideas about what
steps to take:
- create a private submission of the capsule
- test it on a device
- choose a marketplace category
- go through the checklist for submissions
- make a public submission when you are ready to release

Check the excellent documentation about
[How to prepare your capsule for submission](https://bixbydevelopers.com/dev/docs/dev-guide/developers/deploying.prep-marketplace)

Next: [Maintain and Iterate](07-maintenance-and-iteration.md)
