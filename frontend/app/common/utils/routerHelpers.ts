import { getLastOpenedPanel } from '../../heySpace/utils/lastOpenedPanelController';
import {
  ProjectPanelType,
  RightPanelType,
} from '../models/domain/ProjectsSettingsModel/types';
import { Id } from './identifier';

export function makeTaskLink({ taskId, projectId }) {
  return `${makeProjectLink({ projectId })}/chat/tasks?taskId=${taskId}`;
}

export function makeProjectLink({ projectId }) {
  return `/projects/${projectId}`;
}

export function makeProjectChatLink({ projectId }) {
  return `${makeProjectLink({ projectId })}/chat/tasks`;
}

export function makeConversationLink(
  conversationId: Id,
  projectPanelType?: ProjectPanelType,
  rightPanelType?: RightPanelType
): string {
  if (!projectPanelType) {
    return `/conversations/${conversationId}`;
  }

  if (!rightPanelType) {
    return `/conversations/${conversationId}/${projectPanelType}`;
  }

  return `/conversations/${conversationId}/${projectPanelType}/${rightPanelType}`;
}

export function makeProjectSettingsLink({ projectId }) {
  return `${makeProjectLink({ projectId })}/chat/settings/`;
}
