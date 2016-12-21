import * as Alexa from 'alexa-sdk';
import * as assert from 'assert';
import { states } from './../src/consts';
import * as lambda from './../src/index';
import * as TestHelper from './test-helper';

describe('Lambda', () => {
  it('should return a speech string for bus', async () => {
    const request1: Alexa.RequestBody = TestHelper.buildRequest(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'bus'
        }
      }
    );

    const response1: Alexa.ResponseBody = await TestHelper.run(lambda, request1);

    assert.equal(TestHelper.isSsml(response1), true, 'The service should return a speech text.');
    assert.equal(TestHelper.isSessionEnded(response1), false, 'The session should not be ended.');
    assert.equal(TestHelper.isStateSet(response1, states.BUS_MODE), true, 'The next state should be BUS.');

    const request2: Alexa.RequestBody = TestHelper.buildRequest(
      'BusNumberIntent',
      {
        BusNumber: {
          name: 'BusNumber',
          value: '102'
        }
      },
      states.BUS_MODE);

    const response2: Alexa.ResponseBody = await TestHelper.run(lambda, request2);
    assert.equal(TestHelper.isSsml(response2), true, 'The service should return a speech text.');
    assert.equal(TestHelper.isSessionEnded(response2), true, 'The session should be ended.');
  });

  it('should return a speech string for tram', async () => {
    const event: Alexa.RequestBody = TestHelper.buildRequest(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'tram'
        }
      });

    const response: Alexa.ResponseBody = await TestHelper.run(lambda, event);
    assert.equal(TestHelper.isSsml(response), true, 'The service should return a speech text.');
    assert.equal(TestHelper.isSessionEnded(response), true, 'The session should be ended.');
  });
});
