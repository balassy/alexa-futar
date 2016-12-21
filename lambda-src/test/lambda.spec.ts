import * as Alexa from 'alexa-sdk';
import * as assert from 'assert';
import { states } from './../src/consts';
import * as IntentRunner from './intent-runner';
import * as TestHelper from './test-helper';

describe('Lambda (end-to-end)', () => {
  describe('GetNextRideIntent', () => {
    it('should return a question for bus', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('bus');

      assert.equal(TestHelper.isSsml(response), true, 'A speech text should be returned');
      assert.equal(TestHelper.isSessionEnded(response), false, 'The session should not be ended.');
      assert.equal(TestHelper.isStateSet(response, states.BUS_MODE), true, 'The next state should be BUS.');
    });

    it('should return the schedule for tram', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callGetNextRide('tram');
      assert.equal(TestHelper.isSsml(response), true, 'A speech text should be returned.');
      assert.equal(TestHelper.isSessionEnded(response), true, 'The session should be ended.');
      assert.equal(TestHelper.isScheduleString(response), true, 'The schedule should be returned.');
    });
  });

  describe('BusNumberIntent', () => {
    beforeEach(async () => {
      await IntentRunner.callGetNextRide('bus');
    });

    it('should return the schedule for bus #102', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('102');
      assert.equal(TestHelper.isSsml(response), true, 'A speech text should be returned.');
      assert.equal(TestHelper.isSessionEnded(response), true, 'The session should be ended.');
      assert.equal(TestHelper.isScheduleString(response), true, 'The schedule should be returned.');
    });

    it('should return the schedule for bus #110', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('110');
      assert.equal(TestHelper.isSsml(response), true, 'A speech text should be returned.');
      assert.equal(TestHelper.isSessionEnded(response), true, 'The session should be ended.');
      assert.equal(TestHelper.isScheduleString(response), true, 'The schedule should be returned.');
    });

    it('should return a question for an invalid bus number', async () => {
      const response: Alexa.ResponseBody = await IntentRunner.callBusNumber('100');
      assert.equal(TestHelper.isSsml(response), true, 'A speech text should be returned.');
      assert.equal(TestHelper.isSessionEnded(response), false, 'The session should not be ended.');
      assert.equal(TestHelper.isScheduleString(response), false, 'The schedule should not be returned.');
    });
  });
});
