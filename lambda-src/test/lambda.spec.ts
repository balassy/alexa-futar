import * as Alexa from 'alexa-sdk';
import { states } from './../src/consts';
import * as assert from './util/assert';
import * as IntentRunner from './util/intent-runner';

describe('Lambda (end-to-end)', () => {
  describe('GetNextRideIntent', () => {
    it('should return a question for bus', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('bus');
      assert.isSsml(response);
      assert.isSessionNotEnded(response);
      assert.isNotSchedule(response);
      assert.isStateSet(response, states.BUS_MODE);
    });

    it('should return a question for bus after a tram schedule', async () => {
      await IntentRunner.callGetNextRide('tram');

      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('bus');
      assert.isSsml(response);
      assert.isSessionNotEnded(response);
      assert.isNotSchedule(response);
      assert.isStateSet(response, states.BUS_MODE);
    });

    it('should return the schedule for tram', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('tram');
      assert.isSsml(response);
      assert.isSessionEnded(response);
      assert.isSchedule(response);
    });

    it('should return the schedule for tram twice', async () => {
      await IntentRunner.callGetNextRide('tram');
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('tram');
      assert.isSsml(response);
      assert.isSessionEnded(response);
      assert.isSchedule(response);
    });

    it('should return the schedule for tram for unknown vehicles', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('ship');
      const responseText = response.response.outputSpeech.ssml;
      assert.equal(responseText.includes('tram'), true, `This was returned instead of a tram response: "${responseText}".`);
      assert.isSsml(response);
      assert.isSessionEnded(response);
      assert.isSchedule(response);
    });
  });

  describe('BusNumberIntent', () => {
    beforeEach(async () => {
      await IntentRunner.callGetNextRide('bus');
    });

    it('should return the schedule for bus #102', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('102');
      assert.isSsml(response);
      assert.isSessionEnded(response);
      assert.isSchedule(response);
    });

    it('should return the schedule for bus #110', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('110');
      assert.isSsml(response);
      assert.isSessionEnded(response);
      assert.isSchedule(response);
    });

    it('should return a question for an invalid bus number', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('100');
      assert.isSsml(response);
      assert.isSessionNotEnded(response);
      assert.isNotSchedule(response);
    });
  });
});
