import { Position } from "../../../../common/types";
import { i18mark } from "../../../../common/i18n";
import { List, Map } from "immutable";

export const positionLabels = Map({
  [Position.TOP]: i18mark('Top'),
  [Position.BOTTOM]: i18mark('Bottom'),
})

export const positionKeys = List(Object.values(Position))
