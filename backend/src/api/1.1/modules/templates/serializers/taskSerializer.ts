import { TaskDbRow } from '../../db/schema';
import { getSerializer } from './helpers';

type TaskSerializedKeysType = keyof (TaskDbRow & { tagTemplates: any[] });

const SERIALIZED_KEYS: TaskSerializedKeysType[] = [
  'name',
  'description',
  'order',
  'progress',
  'status',
  'tagTemplates',
];

export const taskSerializer = getSerializer(SERIALIZED_KEYS);
