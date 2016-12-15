/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { handlers } from './handlers';
const skillConfig = require('./config/skill.json');  // tslint:disable-line no-require-imports no-var-requires 

export function handler(event: any, context: any) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = skillConfig.appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
}
