import { mapObjectToCssVars } from '../helpers';

describe('When using mapObjectTOCssVars', () => {
  it('returns string in css var format', () => {
    expect(
      mapObjectToCssVars({
        color: {
          red: 'red',
          blue: 'blue',
        },
        fontSizeMd: '10px',
      })
    ).toEqual('--color-red:red;--color-blue:blue;--fontSizeMd:10px');
  });
});
