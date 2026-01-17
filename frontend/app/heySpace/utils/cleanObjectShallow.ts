// tslint:disable-next-line: ban-types

type ObjectToClean = { [key: string]: unknown };

export const removeObjectEmptyKeysShallow = (
  obj: ObjectToClean
): Partial<ObjectToClean> =>
  Object.entries(obj).reduce(
    (acc, [key, value]) =>
      !value && typeof value !== 'boolean' ? acc : { ...acc, [key]: value },
    {}
  );
