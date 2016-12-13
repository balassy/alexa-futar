import * as uuid from 'uuid';

import * as lambda from './index';

function buildEvent(intentName: string, slots: any = {}) {
  const appGuid = uuid();
  const requestGuid = uuid();
  const sessionGuid = uuid();
  const userGuid = uuid();
  const now = new Date().toISOString();

  return {
    session: {
      sessionId: `SessionId.${sessionGuid}`,
      application: {
        applicationId: `amzn1.ask.skill.${appGuid}`
      },
      attributes: {},
      user: {
        userId: `amzn1.ask.account.${userGuid}`
      },
      new: true
    },
    request: {
      type: 'IntentRequest',
      requestId: `EdwRequestId.${requestGuid}`,
      locale: 'en-US',
      timestamp: now,
      intent: {
        name: intentName,
        slots: slots
      }
    },
    version: '1.0'
  };
}

function parseResponse(response: any) {
  const ssml = response.response.outputSpeech.ssml;
  return ssml;
}

const event = buildEvent('GetNextRideIntent');

const context = {
  succeed: (result: any) => {
    const ssml = parseResponse(result);
    console.log('SUCCEED:', ssml);
  },

  fail: (err: Error) => {
    console.log('FAILED:', err);
  }
};


lambda.handler(event, context);
