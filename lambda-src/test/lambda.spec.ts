import * as assert from 'assert';
import * as lambda from '../index';
import { RunHelper } from './run-helper';

describe('Lambda', () => {
  it('should return a speech string for bus', (done) => {
    runTest('bus', done);
  });

  it('should return a speech string for tram', (done) => {
    runTest('tram', done);
  });

  function runTest(vehicleName: string, done: Function) {
    const runHelper = new RunHelper();
    const intentName = 'GetNextRideIntent';
    const slots = {
      Vehicle: {
        name: 'Vehicle',
        value: vehicleName
      }
    };
    const event = runHelper.buildEvent(intentName, slots);

    const context = {
      succeed: (response: any) => {
        const isSsml = runHelper.isSsml(response);
        assert.equal(isSsml, true);
        done();
      },

      fail: (err: any) => {
        done(new Error(err));
      }
    };

    lambda.handler(event, context);
  }
});
