import Errors from '../src/HeySpaceRestApiClient/Errors'
import 'mocha';

const assert = require('assert');

describe('BadEnvelopeError', () => {
  it('body is an object when given argument null', () => {
    const error = new Errors.BadEnvelopeError(null);
    assert.equal(typeof error.params.body === 'object' && error.params.body !== null, true);
  });

  it('body is an object when given argument undefined', () => {
    const error = new Errors.BadEnvelopeError(undefined);
    assert.equal(typeof error.params.body === 'object' && error.params.body !== null, true);
  });

  it('body is an object when given argument object', () => {
    const error = new Errors.BadEnvelopeError({});
    assert.equal(typeof error.params.body === 'object' && error.params.body !== null, true);
  });
});