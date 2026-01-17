import { RandomSourceInterface } from './RandonSourceInterface'
import { range, random } from 'lodash';
import { injectable } from 'inversify'

const LETTERS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const LETTERS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

@injectable()
export class RandomSource
  implements RandomSourceInterface
{
  alnumString(length: number): string {
    const chars = ''.concat(LETTERS_LOWER, LETTERS_UPPER, DIGITS);
    return range(0, length).map(_ => chars[this.int(0, chars.length)]).join('');
    
  }
  
  float(min: number, max: number): number {
    return random(min, max, true);
  }

  int(min: number, max: number): number {
    return random(min, max - 1, false);
  }
}