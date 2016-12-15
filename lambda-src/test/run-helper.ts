import * as uuid from 'uuid';

export class RunHelper {

  public buildEvent(intentName: string, slots: any = {}) {
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
          userId: `amzn1.ask.account.${userGuid}`,
          accessToken: ''
        },
        new: true
      },
      request: {
        type: 'IntentRequest',
        requestId: `EdwRequestId.${requestGuid}`,
        locale: 'en-US',
        reason: '',
        timestamp: now,
        intent: {
          name: intentName,
          slots: slots
        }
      },
      version: '1.0'
    };
  }

  public isSsml(response: any): boolean {
    return response.response.outputSpeech.type === 'SSML';
  }

}
