import isEmpty from 'lodash/isEmpty'
import * as ExtensionDataTypes from '../ExtensionsModel/constants/extensionDataTypes'
import { ExtensionsData } from '../ExtensionsModel/types';
import { Maybe } from 'common/types'

export function getInvitationTokenFromExtensionsData(extensionsData: ExtensionsData): Maybe<string> {
  if (isEmpty(extensionsData)) {
    return null
  }
  const chatWithMeTokens = extensionsData[ExtensionDataTypes.CHAT_WITH_ME_TOKEN]
  if (!chatWithMeTokens || chatWithMeTokens.length === 0) {
    return null
  }
  const invitationToken = chatWithMeTokens[0]
  return invitationToken.token
}
