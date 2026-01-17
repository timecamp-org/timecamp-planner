import { ColorsThemeInterface, getPalette } from '../helpers';

describe('When parsing figma theme JSON with getPalette', () => {
  it('should return type of ColorsThemeInterface', () => {
    const palette = getPalette('light');
    const examplePalette: Partial<ColorsThemeInterface> = {
      black: '',
      white: '',
      accent: {
        '100': '',
        '200': '',
        '300': '',
        '50': '',
        '400': '',
        '500': '',
        '600': '',
        '700': '',
        '800': '',
        '900': '',
      },
    };

    expect(palette).toBeInstanceOf(examplePalette);
  });
});
