import { Id } from '../../common/identifier';


export interface LinkedViewSettingsProviderInterface {

  createViewSettingsLink(baseViewSettingsId: Id, linkedViewSettingsId: Id, trx?: Transaction): PromiseLike<void>;

  removeViewSettingsLink(baseViewSettingsId: Id, linkedViewSettingsId: Id): PromiseLike<void>;

  getLinkedViewSettingsIdsByBaseId(baseViewSettingsId: Id): PromiseLike<Id[]>
}
