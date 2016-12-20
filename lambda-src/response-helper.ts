import * as Alexa from 'alexa-sdk';
const skillConfig = require('./config/skill.json');  // tslint:disable-line no-require-imports no-var-requires 

export class ResponseHelper {
  /**
   * Produces a successful response to the user.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} speechOutput - The message to say to the user.
   */
  public tell(handlerContext: Alexa.Handler, speechOutput: string) {
    handlerContext.emit(':tell', speechOutput);
  }

  /**
   * Produces a successful response to the user.
   * @param {Alexa.Handler} handlerContext - The value of the `this` parameter within an intent handler.
   * @param {string} speechOutput - The message to say to the user.
   */
  public ask(handlerContext: Alexa.Handler, speechOutput: string, repromptSpeech: string) {
    handlerContext.emit(':ask', speechOutput, repromptSpeech);
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
