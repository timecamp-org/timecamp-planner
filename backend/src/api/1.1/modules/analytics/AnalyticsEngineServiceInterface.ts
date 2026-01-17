import { UserTrackerEventJson } from "./types";
import { Id } from "../common/identifier";

export default interface AnalyticsEngineServiceInterface {
  pushEventsWithActor(events: UserTrackerEventJson[], actorId: Id, actorIp: string) : Promise<void>
}
