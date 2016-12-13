# Alexa Futár

An AWS Lambda function and Amazon Alexa skill that allows querying Budapest public transport information.


## Development

Useful Gulp tasks:

`gulp build` - Rebuilds the output ZIP package that contains the code of the Lambda function, and can be uploaded to AWS.

`gulp build:incremental` - Recompiles the TypeScript files and rebuilds the output ZIP package, using the previously downloaded Node modules in the output folder.

`gulp deploy` - Uploads the previously built ZIP pack to AWS.

`gulp update` - `gulp build:incremental` + `gulp deploy`

`gulp test` - Runs the unit tests on the compiled code.


## About the author

This project is maintaned by [György Balássy](http://gyorgybalassy.wordpress.com).
