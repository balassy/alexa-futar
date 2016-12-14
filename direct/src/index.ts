/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { handlers } from './handlers';

export function handler(event: any, context: any) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
}
