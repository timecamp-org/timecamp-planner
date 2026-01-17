import { List, Map } from 'immutable'
import { UserInterface } from '../../UsersModel/types'
import {QuickSwitcherChatDescriptor} from "../models";
import {Id} from "../../../../utils/identifier";
import { BaseConversationDescriptorRecordInterface, QuickSwitcherChatDescriptorRecordInterface } from '../types';

const emptyList = List()

export function getConversationName(people: List<UserInterface>): string {
  let result = ''

  people.forEach(user => {
    const name = getUserName(user)

    if (name && name !== '') {
      result = result ? `${result}, ${name}` : name
    }
  })

  return result
}

export function getUserName(user: UserInterface): string {
  const { firstName, lastName, email } = user
  return firstName && lastName ? `${firstName} ${lastName}` : `${email}`
}

export const injectLatestMessageCreatedAtToDescriptors = (
    descriptors: List<BaseConversationDescriptorRecordInterface>,
    objectMessages: Map<Id, List<Id>>,
    messagesCreatedAt: Map<Id, number>
  ): List<BaseConversationDescriptorRecordInterface> =>
    descriptors.map(descriptor => {
      const projectId = descriptor.get('projectId')
      const objectMessageIds = objectMessages.get(projectId) || emptyList as List<Id>
      const lastMessageId = objectMessageIds
        .sort((aId, bId) => messagesCreatedAt.get(aId) - messagesCreatedAt.get(bId))
        .last()

      const lastConversationMessageCreatedAt =
        lastMessageId
          ? messagesCreatedAt.get(lastMessageId)
          : null

      return descriptor.set('lastConversationMessageCreatedAt', lastConversationMessageCreatedAt)
    }) as List<BaseConversationDescriptorRecordInterface>

export const sortConversationDescriptorsByLatestMessage =
  (descriptors: List<QuickSwitcherChatDescriptorRecordInterface>): List<QuickSwitcherChatDescriptorRecordInterface> =>
    descriptors.sort((descA, descB) =>
      descB.get('lastConversationMessageCreatedAt') - descA.get('lastConversationMessageCreatedAt')) as List<QuickSwitcherChatDescriptorRecordInterface>
