import EventEmitter from 'eventemitter3';

import HeySpaceRestApiClient from '../HeySpaceRestApiClient';
import UserContext, { UserContextInterface } from '../UserContext';

import { ClientOptionsInterface } from './types';

export * from './types';

export interface HeySpaceClientInterface {
  userContext: UserContextInterface;
  restApiClient: HeySpaceRestApiClient;
  clientErrorEmitter: EventEmitter;
}

export class HeySpaceClient implements HeySpaceClientInterface {
  userContext: UserContextInterface;

  restApiClient: HeySpaceRestApiClient;

  clientErrorEmitter: EventEmitter;

  constructor(
    options: ClientOptionsInterface,
    userContext: UserContextInterface
  ) {
    options = {
      restApi: {
        endpoint: `http://pikachu.timecamp.com:3001/`,
      },
      ...options,
    };

    // initialize publicly exposed REST APIs
    this.restApiClient = new HeySpaceRestApiClient(options.restApi);

    if (typeof userContext === 'undefined') {
      this.userContext = new UserContext();
    } else {
      this.userContext = userContext;
    }

    this.clientErrorEmitter = new EventEmitter();
  }
}
