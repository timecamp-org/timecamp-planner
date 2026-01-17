import ErrorDefinitions, { Type } from '../api/1.1/modules/common/ErrorDefinitions';
import { get, set } from 'lodash';
import { AuthenticationOptions } from './types';
import { oAuthServer } from '../services';
import * as OAuthServer from 'oauth2-server';
import { NextFunction, Response, Request } from 'express';
import AuthResult from '../api/1.1/modules/authentication/AuthResult';

export default function (options: AuthenticationOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (get(req, 'heyspace.authResult.isAuthenticated', false)) {
      next();
    } else {
      authenticateWithOAuth2(req, res, next, options);
    }
  };
}

function authenticateWithOAuth2(req: Request, res: Response, next: NextFunction, options: AuthenticationOptions = {}) {
  const request = new OAuthServer.Request({
    headers: { authorization: req.headers.authorization },
    method: req.method,
    query: req.query,
    body: req.body,
  });
  const response = new OAuthServer.Response(res);
  oAuthServer
    .authenticate(request, response, options)
    .then((token: OAuthServer.Token) => {
      set(req, 'heyspace.authResult', new AuthResult(token.user.id));
      next();
    })
    .catch(function (error) {
      console.error(error);
      const errorResponse = ErrorDefinitions[Type.INVALID_AUTH_TOKEN];
      errorResponse.body = error.message;
      return res.send(errorResponse);
    });
}
