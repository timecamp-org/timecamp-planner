import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import { i18n } from '../../../../i18n'

export const refreshAppHumanMessage = HumanMessage({
  kind: HumanMessageKind.information,
  text: i18n.t("We've got some exciting changes! App will be reloaded in a few seconds..."),
})
