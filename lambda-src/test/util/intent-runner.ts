import * as Alexa from 'alexa-sdk';
import * as uuid from 'uuid';
import { states } from './../../src/consts';
import * as lambda from './../../src/index';

const skillConfig = require('./../../config/skill.json');  // tslint:disable-line no-require-imports no-var-requires

export function callGetNextRide(vehicleType: string): Promise<Alexa.ResponseBody> {
  if (!vehicleType) {
    throw new Error('Please specify the type of the vehicle!');
  }

  const request: Alexa.RequestBody = buildRequest(
    'GetNextRideIntent',
    {
      Vehicle: {
        name: 'Vehicle',
        value: vehicleType
      }
    }
  );

  return run(lambda, request);
}

export function callBusNumber(busNumber: string): Promise<Alexa.ResponseBody> {
  if (!busNumber) {
    throw new Error('Please specify the number of the bus!');
  }

  const request: Alexa.RequestBody = buildRequest(
    'BusNumberIntent',
    {
      BusNumber: {
        name: 'BusNumber',
        value: busNumber
      }
    },
    states.BUS_MODE);

  return run(lambda, request);
}

function buildRequest(intentName: string, slots: any = {}, state?: string) : Alexa.RequestBody {
  const requestGuid = uuid();
  const sessionGuid = uuid();
  const userGuid = uuid();
  const now = new Date().toISOString();

  return {
    session: {
      sessionId: `SessionId.${sessionGuid}`,
      application: {
        applicationId: skillConfig.appId
      },
      attributes: {
        STATE: state
      },
      user: {
        userId: `amzn1.ask.account.${userGuid}`,
        accessToken: ''
      },
      new: true
    },
    request: <Alexa.IntentRequest> {
      type: 'IntentRequest',
      requestId: `EdwRequestId.${requestGuid}`,
      locale: 'en-US',
      reason: '',
      timeStamp: now,
      intent: {
        name: intentName,
        slots: slots
      }
    },
    version: '1.0'
  };
}

function run(lambda: { handler: Function }, request: Alexa.RequestBody) : Promise<Alexa.ResponseBody> {
  return new Promise((resolve, reject) => {
    const context = {
      succeed: (response: Alexa.ResponseBody) => {
        resolve(response);
      },
      fail: (err: any) => {
        reject(new Error(err));
      }
    };

    lambda.handler(request, context);
  });
}
