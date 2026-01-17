import { ChecklistItemDbRow } from '../../db/schema';
import { getSerializer } from './helpers';

type ChecklistItemSerializedKeysType = keyof ChecklistItemDbRow;

const SERIALIZED_KEYS: ChecklistItemSerializedKeysType[] = ['name', 'order'];

export const checklistItemSerializer = getSerializer(SERIALIZED_KEYS);
