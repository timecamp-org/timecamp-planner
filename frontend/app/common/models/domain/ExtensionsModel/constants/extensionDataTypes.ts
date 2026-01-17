import { ExtensionNamespace, RelationType } from '../types';

const PREFIX = 'extension-data'

export const TASK_VOTING_REACTION = `${PREFIX}.${ExtensionNamespace.TASK_VOTING}_${RelationType.REACTION}`
export const TASK_RECURRENCE_SETTINGS = `${PREFIX}.${ExtensionNamespace.TASK_RECURRENCE}_${RelationType.SETTINGS}`
export const TASK_RECURRENCE_DEPENDENCY = `${PREFIX}.${ExtensionNamespace.TASK_RECURRENCE}_${RelationType.DEPENDENCY}`
export const CHAT_WITH_ME_TOKEN = `${PREFIX}.${ExtensionNamespace.CHAT_WITH_ME}_${RelationType.TOKEN}`
export const KANBAN_CARD_LIMIT = `${PREFIX}.${ExtensionNamespace.KANBAN_LIMITS}_${RelationType.CARDS_LIMIT}`
