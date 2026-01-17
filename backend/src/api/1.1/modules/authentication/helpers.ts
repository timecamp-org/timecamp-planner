import { CookieOptions } from 'express';
import isDev from '../../../../utils/isDev';

export function configureCookie(expiresAt: Date): CookieOptions {
  return {
    expires: expiresAt,
    httpOnly: true,
    ...(!isDev() && {
      sameSite: 'none',
      secure: true,
    }),
  };
}
