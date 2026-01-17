import { Record } from 'immutable'
import { ChecklistItemInterface } from 'models/domain/ChecklistsModel/types'
import { Id } from 'common/utils/identifier'

const defaultChecklistItem: ChecklistItemInterface = {
  id: undefined,
  name: '',
  isChecked: false,
  wasJustCreated: false,
  order: 0,
}

export class ChecklistItem extends Record(defaultChecklistItem) implements ChecklistItemInterface {
  public readonly id!: Id
  public readonly name!: string
  public readonly isChecked!: boolean
  public readonly order!: number
  public readonly wasJustCreated!: boolean

  public constructor(values?: Partial<ChecklistItemInterface>) {
    values ? super(values) : super()
  }
}
