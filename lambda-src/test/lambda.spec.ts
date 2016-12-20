import * as assert from 'assert';
import { states } from './../src/consts';
import * as lambda from './../src/index';
import * as RunHelper from './run-helper';

describe('Lambda', () => {
  it('should return a speech string for bus', (done) => {
    const event1 = RunHelper.buildEvent(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'bus'
        }
      }
    );

    const context1 = {
      succeed: (response1: any) => {
        assert.equal(RunHelper.isSsml(response1), true, 'The service should return a speech text.');
        assert.equal(RunHelper.isSessionEnded(response1), false, 'The session should not be ended.');
        assert.equal(RunHelper.isStateSet(response1, states.BUS_MODE), true, 'The next state should be BUS.');

        const event2 = RunHelper.buildEvent(
          'BusNumberIntent',
          {
            BusNumber: {
              name: 'BusNumber',
              value: '102'
            }
          },
          states.BUS_MODE);

        const context2 = {
          succeed: (response2: any) => {
            assert.equal(RunHelper.isSsml(response2), true, 'The service should return a speech text.');
            assert.equal(RunHelper.isSessionEnded(response2), true, 'The session should be ended.');
            assert.equal(RunHelper.isStateSet(response2, states.BUS_MODE), true, 'The next state should be BUS.');
            done();
          },

          fail: (err: any) => {
            done(new Error(err));
          }
        };

        lambda.handler(event2, context2);
      },

      fail: (err: any) => {
        done(new Error(err));
      }
    };

    lambda.handler(event1, context1);
  });

  it('should return a speech string for tram', (done) => {
    const event = RunHelper.buildEvent(
      'GetNextRideIntent',
      {
        Vehicle: {
          name: 'Vehicle',
          value: 'tram'
        }
      });

    const context = {
      succeed: (response: any) => {
        const isSsml = RunHelper.isSsml(response);
        assert.equal(isSsml, true, 'The service should return a speech text.');

        const isSessionEnded = RunHelper.isSessionEnded(response);
        assert.equal(isSessionEnded, true, 'The session should be ended.');
        done();
      },

      fail: (err: any) => {
        done(new Error(err));
      }
    };

    lambda.handler(event, context);
  });
});
