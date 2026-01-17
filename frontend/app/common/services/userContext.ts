import { UserContext } from 'client';

import { UserContextInterface } from 'client/src/UserContext';

export const UserContextSingleton = (function () {
  let instance;

  return {
    getInstance: function (): UserContextInterface {
      if (!instance) {
        instance = new UserContext();
      }
      return instance;
    },
  };
})();
