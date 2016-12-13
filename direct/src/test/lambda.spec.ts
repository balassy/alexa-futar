import * as assert from 'assert';
import RunHelper from './run-helper';
import * as lambda from '../index';

describe('Lambda', () => {
  it('should return a speech string', (done) => {
    const runHelper = new RunHelper();
    const event = runHelper.buildEvent('GetNextRideIntent');

    const context = {
      succeed: (response: any) => {
        const isSsml = runHelper.isSsml(response);
        assert.equal(isSsml, true);
        done();
      },

      fail: (err: any) =>  {
        done(new Error(err));
      }
    };

    lambda.handler(event, context);
  })
});