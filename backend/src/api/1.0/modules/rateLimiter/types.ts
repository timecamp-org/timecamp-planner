import { RequestHandler } from "express-unless"
import { RateLimitIntervalInterface } from "./interfaces/RateLimitIntervalInterface"
import { Request, Response } from "express"

export type RateLimitOptions = {
  maxConnectionsPerTimeWindow: number,
  interval: RateLimitIntervalInterface,
  message?: string,
  handler?: RequestHandler,
  keyGenerator?: KeyGenerator,
}

export type RateLimitHandler = RequestHandler


export type RateLimitEngine = (options: RateLimitOptions) => RateLimitHandler

export type KeyGenerator = (request: Request, response: Response) => string;

export enum RateLimitRule {
  DEFAULT = 'DEFAULT',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  LOGIN = 'LOGIN',
  GET_FREQUENTLY = 'GET_FREQUENTLY',
  UPDATE_FREQUENTLY = 'UPDATE_FREQUENTLY',
  CREATE_FREQUENTLY = 'CREATE_FREQUENTLY',
  GET_RARELY = 'GET_RARELY',
  UPDATE_RARELY = 'UPDATE_RARELY',
  CREATE_RARELY = 'CREATE_RARELY',
}

export type RateLimitRuleDefinition = {
  [P in RateLimitRule]: RateLimitOptions
}

export interface RateLimitConfig {
  isEnabled: boolean,
}
