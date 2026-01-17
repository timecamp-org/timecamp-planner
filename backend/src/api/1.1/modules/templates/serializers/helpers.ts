import * as _ from 'lodash';

export const getSerializer = (SERIALIZED_KEYS: string[]) => (body: Record<string, any>) => {
  const result = _.pick(body, SERIALIZED_KEYS);

  return _(result).omitBy(_.isNil).value();
};
