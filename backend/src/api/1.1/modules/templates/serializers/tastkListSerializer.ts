import { ListDbRow } from '../../db/schema';

import { getSerializer } from './helpers';
type TaskListSerializedKeysType = keyof ListDbRow;
const SERIALIZED_KEYS: TaskListSerializedKeysType[] = ['name', 'order', 'isArchived'];

export const taskListSerializer = getSerializer(SERIALIZED_KEYS);
