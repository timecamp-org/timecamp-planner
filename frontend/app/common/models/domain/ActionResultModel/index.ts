import { Record } from 'immutable'
import { AnyDict, Dict } from '../../../types';

export interface ActionResultInterface<D = AnyDict> {
  isOk: boolean,
  code: string,
  data: Dict<D>,

  humanMessage: AnyDict, //TODO: add types
}


const defaultActionResult: ActionResultInterface = {
  isOk: false,
  code: null,
  data: null,

  humanMessage: null,
}


export class ActionResult extends Record(defaultActionResult) implements ActionResultInterface {
  public readonly isOk!: boolean
  public readonly code!: string
  public readonly data!: AnyDict
  public readonly humanMessage!: AnyDict

  public constructor(values?: Partial<ActionResultInterface>) {
    values ? super(values) : super()
  }
}

export interface ActionResultPayload<D = AnyDict> {
  actionResult: ActionResultInterface<D>,
}