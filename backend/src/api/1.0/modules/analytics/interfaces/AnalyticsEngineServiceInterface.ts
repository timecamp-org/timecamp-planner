import { Id } from '../../common/identifier'
import { UserTrackerEventJson } from '../types';

export default interface AnalyticsEngineServiceInterface {
  pushEventsWithActor(events: UserTrackerEventJson[], actorId: Id, actorIp: string) : Promise<void>
}
