import { AppVersionDbRow } from '../../db/schema'
import { Id } from '../../common/identifier'

export interface AppVersionProviderInterface {
  getCurrentAppVersion(appPlatformId: Id): PromiseLike<AppVersionDbRow>
}