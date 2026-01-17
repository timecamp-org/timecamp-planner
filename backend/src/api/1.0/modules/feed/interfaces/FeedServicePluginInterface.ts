import { FeedServiceInterface } from "./FeedServiceInterface";

export interface FeedServicePluginInterface {
  attach(feedService: FeedServiceInterface): Promise<void>
  detach(feedService: FeedServiceInterface): Promise<void>
}
