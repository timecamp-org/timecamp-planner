import { Request, Response, Send } from 'express';
import { ErrorResponse as ErrorResponseV11 } from '../api/1.1/modules/common/ErrorDefinitions';
import { ErrorResponse as ErrorResponseV10 } from '../api/1.0/modules/common/ErrorDefinitions';
import { isRawResponseClass } from './utils';

export enum ResponseStatus {
  OK = 'ok',
  ERROR = 'error',
}

/**
 * If response returned by fileController is of type ErrorResponse
 * then proper http statuses are set and returned object is
 * converted to pure json without httpStatus prop.
 *
 * @param {e.Request} req
 * @param {Response} res
 * @param next
 * @return {any}
 */
export default (req: Request, res: Response, next: any) => {
  const send: Send = res.send;
  res.send = (body?: any): Response => {
    const { baseUrl } = req;
    const getVersion = /\/api\/(v[0-9]{1,}\.[0-9]{1,})\/.*|\/api\/.*/;
    const match = baseUrl.match(getVersion);
    const version = match?.[1] || 'v1.0';

    if (body && isRawResponseClass(body)) {
      // leave body at original state
    } else if (body instanceof ErrorResponseV10 || body instanceof ErrorResponseV11) {
      // Must set appropriate http status and return object with proper error messages
      res.status(body.httpStatus);
      body = {
        version,
        status: ResponseStatus.ERROR,
        code: body.errorCode,
        message: body.body,
      };
    } else {
      body = {
        version,
        status: ResponseStatus.OK,
        code: res.statusCode,
        response: body,
      };
    }
    return send.apply(res, [body]);
  };

  return next();
};
