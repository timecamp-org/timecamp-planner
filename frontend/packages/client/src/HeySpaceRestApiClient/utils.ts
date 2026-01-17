import Errors, { ErrorParams } from './Errors';
import * as async from 'async';
import get from 'lodash/get';

const APPLICATION_JSON_WITH_ENCODING = 'application/json; charset=utf-8';
const TEXT_CSV = 'text/csv; charset=utf-8';

export function jsonToString(json: object = {}): string {
  return JSON.stringify(json, null, 2);
}

export type RepackedResponse = {
  bodyUsed: boolean;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: object;
};

export type ResponseEnvelope = {
  code: number;
  response: object;
  status: string;
};

// designed for TC REST API
export function processFetchErrorAndResponse(
  fetchError: Error,
  fetchResponse: Response,
  callback: CallableFunction,
): void {
  // eslint-disable-line
  if (fetchError) {
    return callback(new Errors.FetchError(fetchError));
  }

  const repackedResponse = packResponse(fetchResponse);
  const contentType = fetchResponse.headers.get('content-type');

  async.waterfall(
    [
      function getBodyOrUndefined(callback) {
        // eslint-disable-line no-shadow
        if (!contentType) {
          return callback(null, undefined);
        }
        switch (contentType) {
          case APPLICATION_JSON_WITH_ENCODING: {
            return fetchResponse.json().then(
              (json) => callback(null, json),
              (error) => callback(new Errors.JsonParseError(error), repackedResponse),
            );
          }
          case TEXT_CSV: {
            return fetchResponse.text().then(
              (text) => callback(null, text),
              (error) => callback(error, null),
            );
          }
          default: {
            return fetchResponse.text().then(
              (text) => callback(new Errors.UnsupportedContentTypeError(contentType, text), repackedResponse),
              (error) => callback(new Errors.UnsupportedContentTypeError(contentType, error), repackedResponse),
            );
          }
        }
      },
      function processBody(body: ResponseEnvelope, callback: CallableFunction) {
        // eslint-disable-line
        switch (contentType) {
          case APPLICATION_JSON_WITH_ENCODING: {
            return processJsonBody(fetchResponse, repackedResponse, body, callback);
          }
          case TEXT_CSV: {
            return callback(null, body);
          }
          default: {
            return callback(new Errors.UnsupportedContentTypeError(contentType), repackedResponse);
          }
        }
      },
    ],
    (error, result) => {
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, result);
      }
    },
  );
}

function packResponse(response: Response): RepackedResponse {
  if (!response) {
    return undefined;
  }

  const { bodyUsed, ok, status, statusText, url, headers } = response;
  return {
    bodyUsed,
    ok,
    status,
    statusText,
    url,
    headers,
  };
}

function processJsonBody(
  fetchResponse: Response,
  repackedResponse: RepackedResponse,
  body: ResponseEnvelope,
  callback: CallableFunction,
) {
  const statusCode = fetchResponse.status;
  const statusText = fetchResponse.statusText;
  const url = fetchResponse.url;

  if (!statusCode || typeof statusCode !== 'number') {
    return callback(new Errors.UnexpectedStatusCodeError(statusCode, body, url), repackedResponse);
  }

  if (statusCode >= 600) {
    return callback(new Errors.UnexpectedStatusCodeError(statusCode, body, url), repackedResponse);
  }

  if (statusCode >= 500) {
    return callback(new Errors.ServerError(statusCode, statusText, body, url), repackedResponse);
  }

  if (statusCode >= 400) {
    return callback(new Errors.ClientError(statusCode, statusText, body, url), repackedResponse);
  }

  if (statusCode >= 300) {
    return callback(new Errors.UnexpectedStatusCodeError(statusCode, body, url), repackedResponse);
  }

  if (statusCode >= 200) {
    // expect the body

    if (!body) {
      return callback(new Errors.ExpectedResponseBodyError(statusCode, statusText, url), repackedResponse);
    }

    // validate envelope
    switch (body.status) {
      case 'error':
        if ('code' in body && 'params' in body) {
          const params = get(body, 'params');
          return callback(new Errors.RestApiError(params as ErrorParams, url), repackedResponse);
        } else {
          return callback(new Errors.BadEnvelopeError(body, url), repackedResponse);
        }
      case 'ok':
        if ('code' in body) {
          return callback(null, body.response);
        } else {
          return callback(new Errors.BadEnvelopeError(body, url), repackedResponse);
        }
      default:
        return callback(new Errors.BadEnvelopeError(body, url), repackedResponse);
    }
  }

  return callback(new Errors.UnexpectedStatusCodeError(statusCode, body, url), repackedResponse);
}
