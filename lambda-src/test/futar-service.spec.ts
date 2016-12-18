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
          assert.equal(rideTimes.firstRideAbsoluteTime, '06:35');
          assert.equal(rideTimes.firstRideRelativeTimeInMinutes, 0);
          assert.equal(rideTimes.firstRideRelativeTimeHumanized, 'a minute');
          assert.equal(rideTimes.secondRideAbsoluteTime, '06:53');
          assert.equal(rideTimes.secondRideRelativeTimeHumanized, '18 minutes');
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
          assert.equal(rideTimes.combinedRelativeTimeHumanized, '21 minutes');
          assert.equal(rideTimes.firstRideAbsoluteTime, '06:37');
          assert.equal(rideTimes.firstRideRelativeTimeInMinutes, 1);
          assert.equal(rideTimes.firstRideRelativeTimeHumanized, '2 minutes');
          assert.equal(rideTimes.secondRideAbsoluteTime, '06:57');
          assert.equal(rideTimes.secondRideRelativeTimeHumanized, '19 minutes');
          done();
        });
    });
  });
});
