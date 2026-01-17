import { localStorage } from '../services';

import generateId from './generate-pushid';
import handleError from './handleError';

const SESSION_KEY = 'sessionId';

export default (callback) => {
  localStorage.getItem(SESSION_KEY, (error, sessionId) => {
    handleErrorIfExists(error);
    if (!sessionId) {
      sessionId = generateId('session');
      localStorage.setItem(SESSION_KEY, sessionId, handleErrorIfExists);
    }
    callback(null, sessionId);
  });
};

function handleErrorIfExists(error) {
  if (error) {
    handleError(error);
  }
}
