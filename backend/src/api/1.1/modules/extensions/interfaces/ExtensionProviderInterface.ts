
import { ExtensionDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';
import { QueryModifier } from '../../../../../services/types';

export interface ExtensionProviderInterface {
  getExtensionByNamespace(namespace: string, trx?: Transaction): PromiseLike<ExtensionDbRow>;

  getExtensionsByNamespaces(namespaces: string[], trx?: Transaction): PromiseLike<ExtensionDbRow[]>;

  getExtensionById(id: Id, trx?: Transaction): PromiseLike<ExtensionDbRow>;

  getExtensionsByIds(ids: Id[], trx?: Transaction): PromiseLike<ExtensionDbRow[]>;

  getExtensions(decorate?: QueryModifier): PromiseLike<ExtensionDbRow[]>;
}