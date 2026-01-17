import { UserFeedEvent, UserOnlineStatusListener, UserFeedStatusListener, Broadcast, ClientMessageListener } from "../types";
import * as WebSocket from 'ws'
export interface FeedServiceInterface {
  on(event: UserFeedEvent.USER_OFFLINE, listener: UserOnlineStatusListener);
  on(event: UserFeedEvent.USER_ONLINE, listener: UserOnlineStatusListener);
  on(event: UserFeedEvent.USER_FEED_OPENED, listener: UserFeedStatusListener);
  on(event: UserFeedEvent.USER_FEED_CLOSED, listener: UserFeedStatusListener);
  on(event: UserFeedEvent.CLIENT_MESSAGE, listener: ClientMessageListener);

  broadcast(broadcast: Broadcast): void;
  registerUserSocket(userId: string, socket: WebSocket): void;
  initialize(): void;
  close(): void;
}
