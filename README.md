# Alexa Futár

An AWS Lambda function and Amazon Alexa skill that allows querying Budapest public transport information, even directly from an Amazon Echo device.


## Development

Useful Gulp tasks:

`gulp build` - Rebuilds the output ZIP package (`lambda-src/dist.zip`) that contains the code of the Lambda function, so it can be manually uploaded to AWS.

`gulp build:incremental` - Recompiles the TypeScript files and rebuilds the output ZIP package, using the previously downloaded Node modules in the output `lambda-src/dist` folder.

`gulp deploy` - Uploads the previously built ZIP pack to AWS.

`gulp update` - `gulp build:incremental` + `gulp deploy`

`gulp test` - Runs the unit tests on the compiled code.


## Setup

1. Use the [Amazon Web Services Management Console](https://console.aws.amazon.com/lambda/home) to create a new Lambda function. 
    - Note the ARN of the newly created function.
    - Add the name of the function to the `lambda-src/config/lambda.json` file.

2. Use the [Amazon Apps & Services Developer Portal](https://developer.amazon.com/edw/home.html#/skills/list) to create a new Alexa Skill.
    - Use the files in the `skill-assets` folder to configure the skill.
    - Add the name and the application ID of your new Alexa skill to the `lambda-src/config/skill.json` file.

3. Use the [Amazon Web Services Management Console](https://console.aws.amazon.com/lambda/home) to create a new IAM account that has permissions to update the Lambda function you created in Step 1.
    - Add the credentials of this IAM account to the `lambda-src/config/aws-credentials.json` file.

4. Install and set up Node.js and Gulp on your developer machine.

5. Run `npm install` in the `lambda-src` folder to download the third party dependencies to the `lambda-src/node-modules` folder.

6. Run `gulp build` to compile the code, `gulp deploy` to upload it to the Lambda function. 


## About the code

The main entry point of the Lambda function is the `handler` function in the `lambda-src/src/index.ts` file.

The Alexa skill handlers are registered in the `lambda-src/src/handlers.ts` file.

## Useful links

[Amazon Web Services Lambda Management Console](https://console.aws.amazon.com/lambda/home)

[Amazon Apps & Services Developer Portal Alexa Skills](https://developer.amazon.com/edw/home.html#/skills/list)

## About the author

This project is maintaned by [György Balássy](http://gyorgybalassy.wordpress.com).
