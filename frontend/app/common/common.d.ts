import * as i18next from 'i18next';

// Workaround for https://github.com/isaachinman/next-i18next/issues/1781
declare module 'i18next' {
  interface TFunction {
    <TKeys extends i18next.TFunctionKeys = string, TInterpolationMap extends object = i18next.StringMap>(
      key: TKeys,
      options?: i18next.TOptions<TInterpolationMap> | string,
    ): string;
  }
}
