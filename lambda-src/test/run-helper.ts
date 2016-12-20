import * as Alexa from 'alexa-sdk';
import * as uuid from 'uuid';
const skillConfig = require('./../config/skill.json');  // tslint:disable-line no-require-imports no-var-requires 

export function run(lambda: { handler: Function }, event: Alexa.RequestBody) : Promise<Alexa.ResponseBody> {
  return new Promise((resolve, reject) => {
    const context = {
      succeed: (response: Alexa.ResponseBody) => {
        resolve(response);
      },
      fail: (err: any) => {
        reject(new Error(err));
      }
    };

    lambda.handler(event, context);
  });
}

export function buildEvent(intentName: string, slots: any = {}, state?: string) : Alexa.RequestBody {
  const requestGuid = uuid();
  const sessionGuid = uuid();
  const userGuid = uuid();
  const now = new Date().toISOString();

  const result = {
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

  return result;
}

export function isSsml(response: Alexa.ResponseBody): boolean {
  return response.response.outputSpeech.type === 'SSML';
}

export function isSessionEnded(response: Alexa.ResponseBody): boolean {
  return response.response.shouldEndSession;
}

export function isStateSet(response: Alexa.ResponseBody, expectedState: string): boolean {
  return response.sessionAttributes.STATE === expectedState;
}
