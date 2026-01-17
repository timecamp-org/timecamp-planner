import { AnyDict } from 'common/types';

const removeEmpty = (obj: AnyDict) =>
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      removeEmpty(val);
    } else if (val == null) {
      delete obj[key];
    }
  });

export default removeEmpty;
