import { FeedServicePluginInterface } from "./interfaces/FeedServicePluginInterface";
import { FeedServiceInterface } from "./interfaces/FeedServiceInterface";
import { injectable } from "inversify";

@injectable()
export abstract class AbstractFeedServicePlugin implements FeedServicePluginInterface {
  async attach(feedService: FeedServiceInterface): Promise<void> {
    // nothing to do, implement
  }  
  
  async detach(feedService: FeedServiceInterface): Promise<void> {
    // nothing to do, implement
  }
}