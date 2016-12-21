import * as Alexa from 'alexa-sdk';
import { states } from './../src/consts';
import * as lambda from './../src/index';
import * as TestHelper from './test-helper';

export function callGetNextRide(vehicleType: string): Promise<Alexa.ResponseBody> {
  if (!vehicleType) {
    throw new Error('Please specify the type of the vehicle!');
  }

  const request: Alexa.RequestBody = TestHelper.buildRequest(
    'GetNextRideIntent',
    {
      Vehicle: {
        name: 'Vehicle',
        value: vehicleType
      }
    }
  );

  return TestHelper.run(lambda, request);
}

export function callBusNumber(busNumber: string): Promise<Alexa.ResponseBody> {
  if (!busNumber) {
    throw new Error('Please specify the number of the bus!');
  }

  const request: Alexa.RequestBody = TestHelper.buildRequest(
    'BusNumberIntent',
    {
      BusNumber: {
        name: 'BusNumber',
        value: busNumber
      }
    },
    states.BUS_MODE);

  return TestHelper.run(lambda, request);
}
