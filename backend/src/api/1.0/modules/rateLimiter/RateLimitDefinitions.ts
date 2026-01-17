import { RateLimitRule, RateLimitRuleDefinition } from './types';
import { NMinutesInterval } from './intervals/NMinutesInterval';
import { NSecondsInterval } from './intervals/NSecondsInterval';

export default {
  [RateLimitRule.DEFAULT]: {
    maxConnectionsPerTimeWindow: 50,
    interval: new NMinutesInterval(5),
  },
  [RateLimitRule.CREATE_ACCOUNT]: {
    maxConnectionsPerTimeWindow: 10,
    interval: new NMinutesInterval(5),
  },
  [RateLimitRule.LOGIN]: {
    maxConnectionsPerTimeWindow: 50,
    interval: new NMinutesInterval(1),
  },
  [RateLimitRule.GET_FREQUENTLY]: {
    maxConnectionsPerTimeWindow: 50,
    interval: new NSecondsInterval(10),
  },
  [RateLimitRule.UPDATE_FREQUENTLY]: {
    maxConnectionsPerTimeWindow: 200,
    interval: new NSecondsInterval(5),
  },
  [RateLimitRule.CREATE_FREQUENTLY]: {
    maxConnectionsPerTimeWindow: 200,
    interval: new NSecondsInterval(10),
  },
  [RateLimitRule.UPDATE_RARELY]: {
    maxConnectionsPerTimeWindow: 50,
    interval: new NSecondsInterval(30),
  },
  [RateLimitRule.CREATE_RARELY]: {
    maxConnectionsPerTimeWindow: 50,
    interval: new NMinutesInterval(1),
  },
  [RateLimitRule.GET_RARELY]: {
    maxConnectionsPerTimeWindow: 20,
    interval: new NSecondsInterval(10),
  },
} as RateLimitRuleDefinition;
