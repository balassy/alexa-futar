import * as Alexa from 'alexa-sdk';
import * as assert from 'assert';
import { states } from './../src/consts';
import * as lambda from './../src/index';
import * as RunHelper from './run-helper';

describe('Lambda', () => {
  it('should return a speech string for bus', async () => {
    const request1: Alexa.RequestBody = RunHelper.buildRequest(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'bus'
        }
      }
    );

    const response1: Alexa.ResponseBody = await RunHelper.run(lambda, request1);

    assert.equal(RunHelper.isSsml(response1), true, 'The service should return a speech text.');
    assert.equal(RunHelper.isSessionEnded(response1), false, 'The session should not be ended.');
    assert.equal(RunHelper.isStateSet(response1, states.BUS_MODE), true, 'The next state should be BUS.');

    const request2: Alexa.RequestBody = RunHelper.buildRequest(
      'BusNumberIntent',
      {
        BusNumber: {
          name: 'BusNumber',
          value: '102'
        }
      },
      states.BUS_MODE);

    const response2: Alexa.ResponseBody = await RunHelper.run(lambda, request2);
    assert.equal(RunHelper.isSsml(response2), true, 'The service should return a speech text.');
    assert.equal(RunHelper.isSessionEnded(response2), true, 'The session should be ended.');
  });

  it('should return a speech string for tram', async () => {
    const event: Alexa.RequestBody = RunHelper.buildRequest(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'tram'
        }
      });

    const response: Alexa.ResponseBody = await RunHelper.run(lambda, event);
    assert.equal(RunHelper.isSsml(response), true, 'The service should return a speech text.');
    assert.equal(RunHelper.isSessionEnded(response), true, 'The session should be ended.');
  });
});
