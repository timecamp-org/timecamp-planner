import { ProjectDbRow } from '../../db/schema';
import { getSerializer } from './helpers';

type ProjectSerializedKeysType = keyof ProjectDbRow;
const SERIALIZED_KEYS: ProjectSerializedKeysType[] = [
  'color',
  'description',
  'iconType',
  'name',
  'organizationId',
  'projectType',
  'backgroundImageUrl',
  'isPrivate',
];

export const projectSerializer = getSerializer(SERIALIZED_KEYS);
