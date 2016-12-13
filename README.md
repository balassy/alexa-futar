# Alexa Futár

An AWS Lambda function and Amazon Alexa skill that allows querying Budapest public transport information.


## Development

Useful Gulp tasks:

`gulp pack` - Rebuilds the output ZIP package that contains the code of the Lambda function, and can be uploaded to AWS.

`gulp pack:incremental` - Recompiles the TypeScript files and rebuilds the output ZIP package, using the previously downloaded Node modules in the output folder.

`gulp upload` - Uploads the previously built ZIP pack to AWS.

`gulp update` - `gulp pack:incremental` + `gulp upload`


## About the author

This project is maintaned by [György Balássy](http://gyorgybalassy.wordpress.com).
