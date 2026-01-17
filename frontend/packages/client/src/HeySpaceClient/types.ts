import { RestApiOptionsInterface } from '../HeySpaceRestApiClient/types'

export type ClientOptionsInterface = {
  restApi: RestApiOptionsInterface,
}

export enum MessageType {
  WELCOME = 'welcome',
  PING = 'ping',
  CONTROL_COMMAND = 'controlCommand',
}

export type FeedEventHandler = (event: string) => void

export interface FeedConnectionInstance {
  on: (eventName: string, handler: FeedEventHandler) => void,
  off: (eventName: string, handler: FeedEventHandler) => void,
  once: (eventName: string, handler: FeedEventHandler) => void,
  unsubscribe: VoidFunction,
  reconnect: VoidFunction,
  close: VoidFunction,
}
