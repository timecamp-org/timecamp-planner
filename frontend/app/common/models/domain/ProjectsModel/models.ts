import { List } from 'immutable';
import { makeTypedFactory } from 'typed-immutable-record';
import { EntityStatus } from '../EntityModel/types';
import {
  BaseConversationDescriptorInterface,
  BaseConversationDescriptorRecordInterface,
  ConversationDescriptorInterface,
  ConversationDescriptorRecordInterface,
  ProjectInterface,
  ProjectRecordInterface,
  ProjectType,
  QuickSwitcherChatDescriptorInterface,
  QuickSwitcherChatDescriptorRecordInterface,
} from './types';

const defaultProject: ProjectInterface = {
  id: undefined,
  status: EntityStatus.EXISTS,
  name: undefined,
  color: undefined,
  description: undefined,
  projectType: ProjectType.PROJECT,
  iconType: undefined,
  isPrivate: undefined,
  autoJoin: undefined,
  organizationId: undefined,
  backgroundImageUrl: undefined,
};

export const Project = makeTypedFactory<ProjectInterface | ProjectRecordInterface, ProjectRecordInterface>(
  defaultProject,
);

const defaultBaseConversationDescriptor: BaseConversationDescriptorInterface = {
  conversationId: null,
  projectId: null,
  type: ProjectType.DIRECT_CHAT,
  name: '',
  lastConversationMessageCreatedAt: null,
};

export const BaseConversationDescriptor = makeTypedFactory<
  BaseConversationDescriptorInterface | BaseConversationDescriptorRecordInterface,
  BaseConversationDescriptorRecordInterface
>(defaultBaseConversationDescriptor);

const defaultConversationDescriptor: ConversationDescriptorInterface = {
  conversationId: null,
  projectId: null,
  type: ProjectType.DIRECT_CHAT,
  people: List(),
  name: '',
  isGuestConversation: false,
  lastConversationMessageCreatedAt: null,
};

export const ConversationDescriptor = makeTypedFactory<
  ConversationDescriptorInterface | ConversationDescriptorRecordInterface,
  ConversationDescriptorRecordInterface
>(defaultConversationDescriptor);

const defaultQuickSwitcherChatDescriptor: QuickSwitcherChatDescriptorInterface = {
  projectId: null,
  conversationId: null,
  name: '',
  type: ProjectType.PROJECT,
  isCurrentUserSpaceMember: false,
  lastConversationMessageCreatedAt: null,
};

export const QuickSwitcherChatDescriptor = makeTypedFactory<
  QuickSwitcherChatDescriptorInterface | QuickSwitcherChatDescriptorRecordInterface,
  QuickSwitcherChatDescriptorRecordInterface
>(defaultQuickSwitcherChatDescriptor);
