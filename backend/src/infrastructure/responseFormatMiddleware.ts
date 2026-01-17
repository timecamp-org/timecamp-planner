import { Request, Response, Send } from 'express';
import { toJson } from '../utils/index';
export enum ContentType {
  JSON = 'application/json',
  ANY = '*/*',
}
import { parseDateToEpochInMS } from './utils';

/**
 * Formats response according to request's `Accept` header.
 * For this to work it must decorate response's `send()` method.
 *
 * @param {e.Request} req
 * @param {Response} res
 * @param next
 * @return {any}
 */
export default (req: Request, res: Response, next: any) => {
  const requestedContentType = req.header('accept');

  const send: Send = res.send;
  res.send = (body?: any): Response => {
    switch (requestedContentType) {
      case ContentType.JSON.toString():
      case ContentType.ANY.toString():
      case undefined:
        body = parseDateToEpochInMS(body);
        body = toJson(body);
        res.setHeader('content-type', ContentType.JSON);
        break;

      default:
        res.statusCode = 415;
        res.statusMessage = `Unsupported response format: [Accept: ${requestedContentType}]`;
        body = toJson({
          status: 'error',
          code: 415,
          message: res.statusMessage,
        });
        res.setHeader('content-type', ContentType.JSON);
    }
    return send.apply(res, [body]);
  };

  return next();
};
