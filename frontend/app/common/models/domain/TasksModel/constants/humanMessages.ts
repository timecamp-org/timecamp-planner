import { HumanMessage } from '../../HumanMessageModel/models';
import { HumanMessageKind } from '../../HumanMessageModel/types';
import { i18n } from '../../../../i18n';

export const startDateEarlierThanDueDateErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Task start date must be earlier than due date`),
});
