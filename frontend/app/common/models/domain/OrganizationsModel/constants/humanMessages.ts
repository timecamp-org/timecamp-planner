import { HumanMessage } from "../../HumanMessageModel/models";
import { HumanMessageKind } from '../../HumanMessageModel/types'
import { i18n } from '../../../../i18n'

export const convertToUserTooMuchUsersErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Before converting guest to user you need to remove some users first.`),
})

export const workspaceOwnerArchiveError = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Only workspace owner can archive this workspace`),
})

export const workspaceOwnerUnarchiveError = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Only workspace owner can unarchive this workspace`),
})
