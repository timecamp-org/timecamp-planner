import { Maybe } from 'common/types';
import hexToHsl from 'hex-to-hsl';
import hslToHex from 'hsl-to-hex';

export interface RGBInterface {
  r: number;
  g: number;
  b: number;
}

export function getColorWithAlpha(colorHex: string, alpha: number): Maybe<string> {
  if (!colorHex?.startsWith('#') || !alpha) {
    return null;
  }
  const rgb: RGBInterface = hexToRgb(colorHex);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

export function getColorWithLightness(colorHex: string, lightness: number): Maybe<string> {
  if (!colorHex?.startsWith('#') || !lightness) {
    return null;
  }
  const [h, s, l] = hexToHsl(colorHex);
  return hslToHex(h, s, lightness || l);
}

export function getShadedColor(colorHex: string, percent: number): Maybe<string> {
  if (!colorHex?.startsWith('#')) {
    return null;
  }
  const rgb = hexToRgb(colorHex);
  let red = Math.floor(rgb.r + (percent / 100) * 255);
  let green = Math.floor(rgb.g + (percent / 100) * 255);
  let blue = Math.floor(rgb.b + (percent / 100) * 255);

  red = Math.max(0, Math.min(red, 255));
  green = Math.max(0, Math.min(green, 255));
  blue = Math.max(0, Math.min(blue, 255));

  var RR = red.toString(16).length === 1 ? `0${red.toString(16)}` : red.toString(16);
  var GG = green.toString(16).length === 1 ? `0${green.toString(16)}` : green.toString(16);
  var BB = blue.toString(16).length === 1 ? `0${blue.toString(16)}` : blue.toString(16);

  return `#${RR}${GG}${BB}`;
}

function hexToRgb(hex: string): RGBInterface {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
