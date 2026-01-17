/* eslint-disable @typescript-eslint/ban-types */
import { get, has } from 'lodash';

import { flattenObjectDeep } from '../../common/utils/flattenObjectDeep';

import figmaTheme from './figma-theme.json';

type ColorFullTone = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ColorsThemeInterface = {
  [key in keyof Omit<typeof figmaTheme.light, 'white' | 'black' | 'decorative'>]: {
    [tone in ColorFullTone]: string;
  };
} & {
  white: string;
  black: string;
  decorative: typeof figmaTheme.light.decorative;
};

export const getPalette = (colorMode: 'light' | 'dark') => mapToMuiTheme(figmaTheme[colorMode]) as ColorsThemeInterface;

const mapToMuiTheme = (definition: Object) =>
  Object.entries(definition).reduce((acc, [key, value]) => {
    if (has(value, 'value')) {
      return { ...acc, [key]: get(value, 'value') };
    }

    return { ...acc, [key]: mapToMuiTheme(value) };
  }, {});

const FLATTEN_SETTINGS = { prefix: '--', separator: '-' };

export const mapObjectToCssVars = (varDefinition: Object): string =>
  Object.entries(flattenObjectDeep(varDefinition, FLATTEN_SETTINGS)).reduce(
    (css, [key, value]) => `${css}${key}:${value};`,
    ''
  );
