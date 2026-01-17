// @ts-nocheck

import { AnyDict } from 'src/types';

enum ErrorCode {
  UNSUPPORTED_CONTENT_TYPE_ERROR = 'UNSUPPORTED_CONTENT_TYPE_ERROR',
  FETCH_ERROR = 'FETCH_ERROR',
  JSON_PARSE_ERROR = 'JSON_PARSE_ERROR',
  UNEXPECTED_STATUS_CODE_ERROR = 'UNEXPECTED_STATUS_CODE_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  EXPECTED_RESPONSE_BODY_ERROR = 'EXPECTED_RESPONSE_BODY_ERROR',
  BAD_ENVELOPE_ERROR = 'BAD_ENVELOPE_ERROR',
  REST_API_ERROR = 'REST_API_ERROR',
  BLIP_FRAME_PARSING_ERROR = 'BLIP_FRAME_PARSING_ERROR',
  BLIP_FRAME_TYPE_ERROR = 'BLIP_FRAME_TYPE_ERROR',
  CONNECTION_CLOSED_ERROR = 'CONNECTION_CLOSED_ERROR',
  CONNECTION_FAILED_ERROR = 'CONNECTION_FAILED_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
}

// In tc3jsc we are using browser's Websocket
// Error codes from: https://tools.ietf.org/html/rfc6455
const websocketErrorCodes = {
  1000: 'WS_NORMAL_CLOSURE',
  1001: 'WS_GOING_AWAY',
  1002: 'WS_PROTOCOL_ERROR',
  1003: 'WS_UNSUPPORTED_DATA',
  1005: 'WS_NO_STATUS_RECEIVED',
  1006: 'WS_ABNORMAL_CLOSURE',
  1007: 'WS_INVALID_FRAME_PAYLOAD_DATA',
  1008: 'WS_POLICY_VIOLATION',
  1009: 'WS_MESSAGE_TOO_BIG',
  1010: 'WS_MENDATORY_EXT',
  1011: 'WS_INTERNAL_SERVER_ERROR',
  1015: 'WS_TLS_HANDSHAKE',
};

export type ErrorParams = {
  statusCode: number;
  statusText: string;
  body: object;
};

export interface BaseErrorInterface {
  code: string;
  params: AnyDict;
  message: string;
  innerError?: Error;
  url?: string;
}

function BaseError(code?: string, params?: ErrorParams, message?: string, innerError?: Error, url?: string) {
  this.code = code;
  this.params = mergeParams(params);
  this.message = message;
  this.innerError = innerError;
  this.url = url;
  Error.call(this, this.code);
}
BaseError.prototype = new Error();

function mergeParams(params: Partial<ErrorParams> = {}) {
  return {
    ...params,
    body: params.body || {
      code: null,
    },
    statusCode: params.statusCode,
    statusText: params.statusText,
  };
}

function BlipFrameParsingError(message: string) {
  BaseError.call(this, ErrorCode.BLIP_FRAME_PARSING_ERROR, {}, message);
}
BlipFrameParsingError.prototype = new BaseError();
BlipFrameParsingError.prototype.name = ErrorCode.BLIP_FRAME_PARSING_ERROR;

function BlipFrameTypeError(message: string) {
  BaseError.call(this, ErrorCode.BLIP_FRAME_TYPE_ERROR, {}, message);
}
BlipFrameTypeError.prototype = new BaseError();
BlipFrameTypeError.prototype.name = ErrorCode.BLIP_FRAME_TYPE_ERROR;

function ConnectionClosedError(message: string) {
  BaseError.call(this, ErrorCode.CONNECTION_CLOSED_ERROR, {}, message);
}
ConnectionClosedError.prototype = new BaseError();
ConnectionClosedError.prototype.name = ErrorCode.CONNECTION_CLOSED_ERROR;

function ConnectionFailedError(message: string, errorObject: Error) {
  BaseError.call(this, ErrorCode.CONNECTION_FAILED_ERROR, {}, message, errorObject);
}
ConnectionFailedError.prototype = new BaseError();
ConnectionFailedError.prototype.name = ErrorCode.CONNECTION_FAILED_ERROR;

function ConnectionError(message: string, errorObject: Error) {
  BaseError.call(this, ErrorCode.CONNECTION_ERROR, {}, message, errorObject);
}
ConnectionError.prototype = new BaseError();
ConnectionError.prototype.name = ErrorCode.CONNECTION_ERROR;

function FetchError(error: Error) {
  let params = {};
  let message = error.toString();
  if (error instanceof CloseEvent) {
    // eslint-disable-line
    message = websocketErrorCodes[error.code];
    params = {
      statusCode: error.code,
      body: { message },
    };
  }
  BaseError.call(this, ErrorCode.FETCH_ERROR, params, message, error);
}
FetchError.prototype = new BaseError();
FetchError.prototype.name = ErrorCode.FETCH_ERROR;

function RestApiError(params: ErrorParams, url: string) {
  BaseError.call(this, ErrorCode.REST_API_ERROR, params, null, null, url);
}
RestApiError.prototype = new BaseError();
RestApiError.prototype.name = ErrorCode.REST_API_ERROR;

function UnsupportedContentTypeError(contentType: string, message?: string) {
  BaseError.call(this, ErrorCode.UNSUPPORTED_CONTENT_TYPE_ERROR, { contentType }, message, undefined);
}
UnsupportedContentTypeError.prototype = new BaseError();
UnsupportedContentTypeError.prototype.name = ErrorCode.UNSUPPORTED_CONTENT_TYPE_ERROR;

function JsonParseError(error: Error) {
  BaseError.call(this, ErrorCode.JSON_PARSE_ERROR, {}, error.toString(), error);
}
JsonParseError.prototype = new BaseError();
JsonParseError.prototype.name = ErrorCode.JSON_PARSE_ERROR;

function UnexpectedStatusCodeError(statusCode: number, body: object, url: string) {
  BaseError.call(
    this,
    ErrorCode.UNEXPECTED_STATUS_CODE_ERROR,
    { statusCode, body },
    ErrorCode.UNEXPECTED_STATUS_CODE_ERROR,
    undefined,
    url,
  );
}
UnexpectedStatusCodeError.prototype = new BaseError();
UnexpectedStatusCodeError.prototype.name = ErrorCode.UNEXPECTED_STATUS_CODE_ERROR;

function ServerError(statusCode: number, statusText: string, body: object, url: string) {
  BaseError.call(this, ErrorCode.SERVER_ERROR, { statusCode, statusText, body }, statusText, undefined, url);
}
ServerError.prototype = new BaseError();
ServerError.prototype.name = ErrorCode.SERVER_ERROR;

function ClientError(statusCode: number, statusText: string, body: object, url: string) {
  BaseError.call(this, ErrorCode.CLIENT_ERROR, { statusCode, statusText, body }, statusText, undefined, url);
}
ClientError.prototype = new BaseError();
ClientError.prototype.name = ErrorCode.CLIENT_ERROR;

function ExpectedResponseBodyError(statusCode: number, statusText: string, url: string) {
  BaseError.call(this, ErrorCode.EXPECTED_RESPONSE_BODY_ERROR, { statusCode, statusText }, statusText, undefined, url);
}
ExpectedResponseBodyError.prototype = new BaseError();
ExpectedResponseBodyError.prototype.name = ErrorCode.EXPECTED_RESPONSE_BODY_ERROR;

function BadEnvelopeError(body?: AnyDict, url?: string) {
  BaseError.call(this, ErrorCode.BAD_ENVELOPE_ERROR, { body }, ErrorCode.BAD_ENVELOPE_ERROR, undefined, url);
}
BadEnvelopeError.prototype = new BaseError();
BadEnvelopeError.prototype.name = ErrorCode.BAD_ENVELOPE_ERROR;

export default {
  ErrorCode,
  FetchError,
  RestApiError,
  UnsupportedContentTypeError,
  JsonParseError,
  UnexpectedStatusCodeError,
  ServerError,
  ClientError,
  ExpectedResponseBodyError,
  BadEnvelopeError,
  BlipFrameTypeError,
  BlipFrameParsingError,
  ConnectionError,
  ConnectionClosedError,
  ConnectionFailedError,
};
