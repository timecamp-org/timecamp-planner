import { ViewContainerType, ViewSettingsDbRow, ViewSettingsFullDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';


export interface ViewSettingsProviderInterface {

  getSettngsById(id: Id, trx?: Transaction): PromiseLike<ViewSettingsFullDbRow>;

  getSettngsByIds(ids: Id[]): PromiseLike<ViewSettingsFullDbRow[]>

  getSettngsByTypeAndContainer(
    viewTypeId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    userId: Id
  ): PromiseLike<ViewSettingsFullDbRow>;

  createSettings(viewSettingsJson: Partial<ViewSettingsDbRow>, trx?: Transaction): PromiseLike<ViewSettingsFullDbRow>;

  updateSettings(id: Id, ViewSettingsJson: Partial<ViewSettingsDbRow>, trx?: Transaction): PromiseLike<ViewSettingsFullDbRow>;

  deleteSettings(id: Id): PromiseLike<void>;
}
