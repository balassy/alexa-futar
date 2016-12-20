/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { FutarService } from './futar-service';
import { ResponseHelper } from './response-helper';
import { states } from './states';

const BUS_STOP_ID = 'BKK_F02285';
const BUS_102_ROUTE_ID = 'BKK_1020';
const BUS_110_ROUTE_ID = 'BKK_1100';

const responseHelper = new ResponseHelper();

export const busHandlers: Alexa.Handlers = Alexa.CreateStateHandler(states.BUS_MODE, {
  BusNumberIntent: function(this: Alexa.Handler) {  // tslint:disable-line no-function-expression
    const busNumber: string = (<Alexa.IntentRequest> this.event.request).intent.slots.BusNumber.value;

    let routeId;
    switch (busNumber) {
      case '110': {
        routeId = BUS_110_ROUTE_ID;
        break;
      }
      case '102': {
        routeId = BUS_102_ROUTE_ID;
        break;
      }
      default: {
        responseHelper.redirect(this, 'Unhandled' + states.BUS_MODE);
        return;
      }
    }

    const futarService = new FutarService();
    futarService.getNextRidesForStopAndRoute(BUS_STOP_ID, routeId)
      .then((rides: IRideTimes) => {
        let speechOutput: string;

        if (rides.firstRideRelativeTimeInMinutes >= 8) {
          speechOutput = `Your next bus ${busNumber} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can easily catch it. The second bus goes ${rides.secondRideRelativeTimeHumanized} later at ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 8 && rides.firstRideRelativeTimeInMinutes >= 5) {
          speechOutput = `Your next bus ${busNumber} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can still catch it. After that you have to wait another ${rides.secondRideRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 5 && rides.firstRideRelativeTimeInMinutes >= 2) {
          speechOutput = `Your next bus ${busNumber} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You better run, GO, GO, GO! Or you can wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the bus after the next one.`;
        }
        else {
          speechOutput = `Sorry, your next bus ${busNumber} goes in ${rides.firstRideRelativeTimeHumanized}, and you probably will not get it. You should wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the bus after this one.`;
        }

        this.handler.state = states.DEFAULT;
        responseHelper.tell(this, speechOutput);
      })
      .catch((err: Error) => {
        console.log('CATCH ERROR WITHIN BusNumberIntent: ', err);     // tslint:disable-line:no-console
        const details = `Sorry, your webservice call failed! More information: ${err.message}`;
        responseHelper.tellFailure(this, details);
      });
  },

  Unhandled: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    responseHelper.ask(this, 'Sorry, I could not understand the bus number, please say 102 or 110!', 'Is it 102 or 110?');
  }
});
