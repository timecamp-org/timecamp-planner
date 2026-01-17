import {
  ViewSettingsInterface,
  ViewSettingsRecordInterface,
} from 'models/domain/ViewSettingsModel/types'
import { makeTypedFactory } from 'typed-immutable-record';

const defaultViewSettings: ViewSettingsInterface = {
  id: undefined,
  containerType: undefined,
  containerId: undefined,
  viewType: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

export const ViewSettings = makeTypedFactory<
  ViewSettingsInterface | ViewSettingsRecordInterface,
  ViewSettingsRecordInterface
>
  (defaultViewSettings);