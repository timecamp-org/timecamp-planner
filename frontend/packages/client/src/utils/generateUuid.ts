import { Id } from '../types'

function generateUuid(): Id {
  const chars = (
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz'
  ).split('');
  let out = '';
  let i = -1;
  // rfc4122, version 4 form
  // Fill in random data.  At i==19 set the high bits of clock sequence as
  // per rfc4122, sec. 4.1.5
  while (++i < 36) {
    switch (i) {
      case 8:
      case 13:
      case 18:
      case 23:
        out += '-';
        break;
      case 19:
        out += chars[((0 | Math.random() * 16) & 0x3) | 0x8];
        break;
      default:
        out += chars[0 | Math.random() * 16];
    }
  }

  return out;
}

export default generateUuid;
