import { Record } from 'immutable'
import { Id } from '../../../utils/identifier';
import { ExtensionInterface, ExtensionNamespace, ExtensionType } from './types';

const defaultExtension: ExtensionInterface = {
  id: undefined,
  namespace: undefined,
  name: undefined,
  description: undefined,
  thumbnailUrl: undefined,
  type: undefined,
  isInMarketplace: undefined,
}


export class Extension extends Record(defaultExtension) implements ExtensionInterface {
  public readonly id!: Id
  public readonly namespace!: ExtensionNamespace
  public readonly name!: string
  public readonly description!: string
  public readonly thumbnailUrl!: string
  public readonly type!: ExtensionType
  public readonly isInMarketplace!: boolean

  public constructor(values?: Partial<ExtensionInterface>) {
    values ? super(values) : super()
  }
}
