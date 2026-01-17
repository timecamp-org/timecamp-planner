import { UserTrackerEventJson } from "../types";
import { Id } from "../../common/identifier";

export interface UsageTrackerServiceInterface
{
  handleUsageTrackerEvents(usageTrackerEvents: UserTrackerEventJson[], userId?: Id, userIp?: string): any
}
