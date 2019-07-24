# Create a Bixby Capsule that uses AWS for Cloud Storage

## Overview

This is a tutorial repository, that you may freely clone to create a new Bixby Capsule. It provides some boilerplate
code, and will show you how to create a Bixby capsule that uses Amazon Web Services for its cloud storage.
AWS provides a certain amount of computing resources and storage for free, and is quickly scalable.

If you don't already have an AWS account, skip ahead to that step and request one now. It take 24 hours
to set up completely, and trying to use the DynamoDB before then can lead to unexpected errors.

## Capsule Architecture

This architecture comes from experience creating "My Brain" capsule, which helps people remember short,
miscellaneous bits of information, and recall them later with a simple search
questions. Such a capsule requires cloud storage for each user's memories, to provide an individual experience
and a certain amount of privacy.

This capsule design uses a secret client api key (stored in the Bixby Developer Center) to interact with a REST api
over HTTPS. That REST api is the surface of a private AWS account that provides computing power and
storage resources the capsule needs for remembering things and searching for them again later. The AWS account
contains a Lambda that provides computing resources in the form of a JavaScript program, and storage in the form of
a DynamoDB NoSQL database.

![Storage Architecture](docs/storage-architecture.png)

## Setting up Your Own Capsule

Start by cloning this repository, as it provides some of the boilerplate code you'll need, and follow the step-by-step
instructions in each of the following documents:
- [Request AWS Account](docs/01-request-aws-account.md)
- [Design and Plan](docs/02-design-and-plan.md)
- [Database Setup](docs/03-database-setup.md)
- [Lambda Setup](docs/04-lambda-setup.md)
- [Api Gateway Setup](docs/05-api-gateway-setup.md)
- [Capsule Creation](docs/06-capsule-creation.md)
- [Maintenance and Iteration](docs/07-maintenance-and-iteration.md)
