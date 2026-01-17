import { Dict } from '../../../types';
import { Id } from '../../../utils/identifier';
import { TestType } from './types';

//TODO: move it to backend

export const organizationsConfig = {
  [TestType.TIMECAMP_ORGANIZATION]: ['2f16ff15-ea64-4586-8690-ffc583639656'],
} as Dict<Id[]>;

export const userInOrganizationsConfig = {} as Dict<Id[]>;
