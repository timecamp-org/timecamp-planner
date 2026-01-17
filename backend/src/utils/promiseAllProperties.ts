import { PromisesMap } from '../api/1.0/modules/common/types';

export default function promiseAllProperties<T>(promisesMap: PromisesMap<T>): Promise<T> {
  if (promisesMap === null || typeof promisesMap !== 'object') {
    return Promise.reject(new TypeError('The input argument must be of type Object'));
  }

  const keys = Object.keys(promisesMap);
  const promises = keys.map((key) => {
    return (promisesMap as any)[key];
  });

  return Promise.all(promises).then(results => {
    return results.reduce((resolved, result, index) => {
      resolved[keys[index]] = result;
      return resolved;
    }, {});
  });
}