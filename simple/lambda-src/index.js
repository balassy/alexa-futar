'use strict';

const SERVICE_URL = 'http://bandfutar.azurewebsites.net/nextride';
const SKILL_NAME = 'Next Ride';

const http = require('http');
const Alexa = require('alexa-sdk');

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextRide');
    },
    'GetNextRideIntent': function () {
        this.emit('GetNextRide');
    },
    'GetNextRide': function () {      
        http.get(SERVICE_URL, (result) => {
            let body = '';
        
            result.on('data', (chunk) => {
                body += chunk;
            });
        
            result.on('end', () => {
                const response = JSON.parse(body);
                const nextRide = response[0].nextRides[0];
                const speechOutput = 'Your next tram goes at ' + nextRide;

                this.emit(':tell', speechOutput);
            });
        }).on('error', (err) => {
            const speechOutput = 'Sorry, your webservice call failed! Check the Alexa app for more details.';
            const cardTitle = SKILL_NAME;
            const cardContent = 'Sorry, your webservice call failed! ' + JSON.stringify(err);

            this.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
        });
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
