import figmaTheme from './figma-theme.json';

type ColorFullTone = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type ColorBasicTone = '100' | '500' | '800';

export type ColorsThemeInterface = {
  [key in keyof Omit<typeof figmaTheme.light, 'white' | 'black' | 'decorative'>]: {
    [tone in ColorFullTone]: string;
  };
} & {
  white: string;
  black: string;
  decorative: typeof figmaTheme.light.decorative;
};

type FigmaThemeInterface = typeof figmaTheme;
interface AppTheme {
  color: ColorsThemeInterface;
  fontSize: {
    lg: string;
    base: string;
    sm: string;
    xs: string;
    xxs: string;
    '3xs': string;
  };
  fontFamily: string;
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    none: string;
    snug: string;
    relaxed: string;
    loose: string;
  };
  borderRadius: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  borderWidth: {
    '2': string;
    '4': string;
    '8': string;
    default: string;
  };
}

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends AppTheme {}
  type ThemeOptions = AppTheme;
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    underlined: true;
    'text-reversed': true;
  }
  interface ButtonPropsSizeOverrides {
    xs: true;
  }
}

declare module '@mui/material/Divider' {
  interface DividerPropsVariantOverrides {
    text: true;
  }
}

type FigmaIconSizeProp =
  | 'sm'
  | 'xxs'
  | 'xs'
  | 'lg'
  | 'xl'
  | '2xl'
  | '1x'
  | '2x'
  | '3x'
  | '4x'
  | '5x'
  | '6x'
  | '7x'
  | '8x'
  | '9x'
  | '10x';
