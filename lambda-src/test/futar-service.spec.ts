import * as assert from 'assert';
import * as sinon from 'sinon';
import { FutarService } from './../futar-service';
const busResponse = require('./test-data/bus-response.json');    // tslint:disable-line no-require-imports no-var-requires mocha-no-side-effect-code 
const tramResponse = require('./test-data/tram-response.json');  // tslint:disable-line no-require-imports no-var-requires mocha-no-side-effect-code 

describe('FutarService', () => {
  let service: FutarService;

  beforeEach(() => {
    service = new FutarService();
  });

  describe('getNextRides', () => {
    it('should throw an error when no stopId is specified', () => {
      assert.throws(() => { service.getNextRides(undefined); }, /Please specify the stopId!/);
    });

    it('should return the correct values for a bus response', (done) => {
      const stopData: IStopData = {
        currentTime: busResponse.currentTime,
        data: busResponse.data
      };
      sinon.stub(service, '_getStopData').returns(Promise.resolve(stopData));

      const stopId = 'does not matter';

      service.getNextRides(stopId)
        .then(rideTimes => {
          assert.equal(rideTimes.combinedRelativeTimeHumanized, '17 minutes');
          assert.equal(rideTimes.firstRideAbsoluteTime, '20:11');
          assert.equal(rideTimes.firstRideRelativeTimeInMinutes, 6);
          assert.equal(rideTimes.firstRideRelativeTimeHumanized, '7 minutes');
          assert.equal(rideTimes.secondRideAbsoluteTime, '20:22');
          assert.equal(rideTimes.secondRideRelativeTimeHumanized, '10 minutes');
          done();
        });
    });

    it('should return the correct values for a tram response', (done) => {
      const stopData: IStopData = {
        currentTime: tramResponse.currentTime,
        data: tramResponse.data
      };
      sinon.stub(service, '_getStopData').returns(Promise.resolve(stopData));

      const stopId = 'does not matter';

      service.getNextRides(stopId)
        .then(rideTimes => {
          assert.equal(rideTimes.combinedRelativeTimeHumanized, '32 minutes');
          assert.equal(rideTimes.firstRideAbsoluteTime, '21:01');
          assert.equal(rideTimes.firstRideRelativeTimeInMinutes, 11);
          assert.equal(rideTimes.firstRideRelativeTimeHumanized, '12 minutes');
          assert.equal(rideTimes.secondRideAbsoluteTime, '21:21');
          assert.equal(rideTimes.secondRideRelativeTimeHumanized, '20 minutes');
          done();
        });
    });
  });
});
