import * as Alexa from 'alexa-sdk';
const skillConfig = require('./../config/skill.json');  // tslint:disable-line no-require-imports no-var-requires

export class ResponseHelper {
  /**
   * Produces a successful response to the user.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} speechOutput - The message to say to the user.
   */
  public ask(handlerContext: Alexa.Handler, speechOutput: string, repromptSpeech: string) {
    handlerContext.emit(':ask', speechOutput, repromptSpeech);
  }

  /**
   * Produces a successful response to the user.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} speechOutput - The message to say to the user.
   */
  public tell(handlerContext: Alexa.Handler, speechOutput: string) {
    handlerContext.emit(':tell', speechOutput);
  }

  /**
   * Produces the speech response from the specified ride times.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} vehicleName - The type and the number ofthe vehicle.
   * @param {IRideTimes} rides - OBject that contains the times of the next and the second rides.
   */
  public tellRideTimes(handlerContext: Alexa.Handler, vehicleName: string, rides: IRideTimes) {
    let speechOutput: string;

    if (rides.firstRideRelativeTimeInMinutes >= 8) {
      speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can easily catch it. The second ${vehicleName} goes ${rides.secondRideRelativeTimeHumanized} later at ${rides.secondRideAbsoluteTime}.`;
    }
    else if (rides.firstRideRelativeTimeInMinutes < 8 && rides.firstRideRelativeTimeInMinutes >= 5) {
      speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can still catch it. After that you have to wait another ${rides.secondRideRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime}.`;
    }
    else if (rides.firstRideRelativeTimeInMinutes < 5 && rides.firstRideRelativeTimeInMinutes >= 2) {
      speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You better run, GO! Or you can wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the ${vehicleName} after the next one.`;
    }
    else {
      speechOutput = `Sorry, your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized}, and you probably will not get it. You should wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the ${vehicleName} after this one.`;
    }

    this.tell(handlerContext, speechOutput);
  }

  /**
   * Produces a failure response to the user.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} details - Additional information about the failure.
   */
  public tellFailure(handlerContext: Alexa.Handler, details: string) {
    const speechOutput = 'Sorry, something went wrong! Check the Alexa app for more details.';
    const cardTitle = skillConfig.name;
    const cardContent = details;
    handlerContext.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
  }

  /**
   * Transfers the execution to another intent.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} intentName - The target intent to execute.
   */
  public redirect(handlerContext: Alexa.Handler, intentName: string) {
    handlerContext.emit(intentName);
  }
}
