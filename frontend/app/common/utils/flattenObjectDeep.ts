const DEFAULT_OPTIONS = { prefix: '', separator: '.' };

export const flattenObjectDeep = (obj: Object, options?: { separator?: string; prefix?: string }) => {
  const { prefix, separator } = options || DEFAULT_OPTIONS;
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = `${prefix}${key}`;
    if (value && typeof value === 'object') {
      return Object.assign(acc, flattenObjectDeep(value, { separator, prefix: `${newKey}${separator}` }));
    }

    return Object.assign(acc, { [newKey]: value });
  }, {});
};
