import UserTracker from '../src/UserTracker';
import MemQueue from '../src/UserTracker/MemQueue';
const assert = require('assert');
const sinon = require('sinon');


import 'mocha';
import { QueueInterface } from '../src/UserTracker/interfaces/QueueInterface';
import { TrackerEvent } from '../src/UserTracker/types';
import timestampNow from '../src/utils/timestampNow';


const assertionDelayMiliseconds = 1000;

describe('User Tracker', () => {
  let clock;
  let correctQueue: QueueInterface<TrackerEvent>;
  const httpAgentReturning200 = {
    request: function (url, fetchOptions, callback) {
      callback(null, { status: 200 });
    },
  };
  const logger = {
    error: sinon.spy(),
    log: sinon.spy()
  };

  beforeEach(() => {
    correctQueue = new MemQueue();
    logger.error.resetHistory();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('has no error with right httpAgent and right queue', (done) => {
    const userTracker = new UserTracker(httpAgentReturning200, correctQueue, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    correctQueue.getAll((error, events) => {
      assert.equal(events.length, 0);
      done();
    });
    clock.tick(assertionDelayMiliseconds);
  });

  it('has right error with httpAgent returning error', (done) => {
    const failureError = new Error('httpAgent returning error');
    const httpAgentReturningError = {
      request(url, fetchOptions, callback) {
        callback(failureError);
      },
    };
    const userTracker = new UserTracker(httpAgentReturningError, correctQueue, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    correctQueue.getAll((error, events) => {
      assert.equal(events.length, 1);
      done();
    });
    clock.tick(assertionDelayMiliseconds);
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });

  it('has right error httpAgent returning 500', (done) => {
    const failureError = new Error('httpAgent returning 500');
    const httpAgentReturning500 = {
      request(url, fetchOptions, callback) {
        callback(null, { status: 500, json() { return Promise.resolve(failureError); } });
      },
    };
    const userTracker = new UserTracker(httpAgentReturning500, correctQueue, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    correctQueue.getAll((error, events) => {
      assert.equal(events.length, 1);
      done();
    });
    clock.tick(assertionDelayMiliseconds);
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });

  it('has right error with httpAgent returning 500 and throwing error', (done) => {
    const failureError = new Error('httpAgent returning 500 and throwing error');
    const httpAgentReturning500AndThrowingError = {
      request(url, fetchOptions, callback) {
        callback(null, {
          status: 500,
          json: function () {
            return new Promise(function (resolve, reject) {
              throw failureError;
            });
          },
        });
      },
    };
    const userTracker = new UserTracker(httpAgentReturning500AndThrowingError, correctQueue, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    correctQueue.getAll((error, events) => {
      assert.equal(events.length, 1);
      done();
    });
    clock.tick(assertionDelayMiliseconds);
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });

  it('has right error with queue returning error on getAll', () => {
    const failureError = new Error('queue returning error on getAll');
    const queueReturningErrorOnGetAll: QueueInterface<TrackerEvent> = { 
      push(event, callback) { callback(); }, 
      getAll(callback) { callback(failureError); },
      remove(event, callback) { callback() }
    };
    const userTracker = new UserTracker(httpAgentReturning200, queueReturningErrorOnGetAll, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });

  it('has right error with queue returning error on remove', () => {
    const failureError = new Error('queue returning error on remove');
    const queueReturningErrorOnRemove: QueueInterface<TrackerEvent> = {
      push(event, callback) { callback(); },
      getAll(callback) { 
        callback(undefined, [{ name: 'test', id: 'test::001', epoch: timestampNow() }]); 
      },
      remove(event, callback) {
         callback(failureError); 
      },
    };
    const userTracker = new UserTracker(httpAgentReturning200, queueReturningErrorOnRemove, { logger });
    userTracker.track('test');
    clock.tick(assertionDelayMiliseconds);
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });

  it('has right error with queue returning error on push', () => {
    const failureError = new Error('queue returning error on push');
    const queueReturningErrorOnPush: QueueInterface<TrackerEvent> = {
      push(event, callback) { 
        callback(failureError); 
      },
      getAll(callback) { callback(undefined, []); },
      remove(event, callback) { callback() }
    };
    const userTracker = new UserTracker(httpAgentReturning200, queueReturningErrorOnPush, { logger });
    userTracker.track('test');
    sinon.assert.calledOnce(logger.error);
    sinon.assert.alwaysCalledWithExactly(logger.error, failureError);
  });
});
