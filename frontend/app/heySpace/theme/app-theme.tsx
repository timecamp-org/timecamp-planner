/* eslint-disable @typescript-eslint/naming-convention */

import { getPalette } from './helpers';
import { AppTheme } from './types';

export const theme: AppTheme = {
  color: getPalette('light'),
  fontSize: {
    '3xs': '8px',
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
  },
  fontFamily: 'Poppins, sans-serif',
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '125%',
    normal: '150%',
    none: '100%',
    snug: '137,5%',
    relaxed: '162,5%',
    loose: '200%',
  },
  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '100%',
  },
  borderWidth: {
    '2': '2px',
    '4': '4px',
    '8': '8px',
    default: '1px',
  },
};
