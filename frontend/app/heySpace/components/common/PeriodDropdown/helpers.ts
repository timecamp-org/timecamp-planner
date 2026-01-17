import { PeriodType } from "../../../../common/types";
import { i18mark } from "../../../../common/i18n";
import { List, Map } from "immutable";

export const periodLabels = Map({
  [PeriodType.YEARLY]: i18mark('year'),
  [PeriodType.MONTHLY]: i18mark('month'),
  [PeriodType.WEEKLY]: i18mark('week'),
  [PeriodType.DAILY]: i18mark('day'),
})

export const periodKeys = List(Object.values(PeriodType))
