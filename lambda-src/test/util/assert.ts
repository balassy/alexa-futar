import * as Alexa from 'alexa-sdk';
import * as assert from 'assert';

export { equal } from 'assert';

export function isSsml(response: Alexa.ResponseBody): void {
  assert.equal(response.response.outputSpeech.type, 'SSML', 'The response is expected to be SSML.');
}

export function isSessionEnded(response: Alexa.ResponseBody): void {
  assert.equal(response.response.shouldEndSession, true, 'The session is expected to be ended.');
}

export function isSessionNotEnded(response: Alexa.ResponseBody): void {
  assert.equal(response.response.shouldEndSession, false, 'The session is expected to be not ended.');
}

export function isSchedule(response: Alexa.ResponseBody): void {
  assert.equal(/your next/i.test(response.response.outputSpeech.ssml), true, 'The response is expected to contain a schedule.');
}

export function isNotSchedule(response: Alexa.ResponseBody): void {
  assert.equal(/your next/i.test(response.response.outputSpeech.ssml), false, 'The response is expected to not contain a schedule.');
}

export function isStateSet(response: Alexa.ResponseBody, expectedState: string): void {
  const actualState = response.sessionAttributes.STATE;
  assert.equal(actualState, expectedState, `The response is expected to set the state to '${expectedState}', but it is '${actualState}'.`);
}
