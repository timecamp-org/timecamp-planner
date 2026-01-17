import { LoggerInterface } from '../../../../infrastructure/logger';
import { inject, injectable } from 'inversify';
import { UserSessionServiceInterface } from './UserSessionServiceInterface';
import { Id } from '../common/identifier';
import { OnlineStatusModule } from './OnlineStatusModule';
import { FeedServiceInterface } from '../feed/interfaces/FeedServiceInterface';
import { UserFeedEvent, ClientMessage, ClientMessageType } from '../feed/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { FeedModule } from '../feed/FeedModule';
import { AnyDict } from '../common/types';
import { AbstractFeedServicePlugin } from '../feed/AbstractFeedServicePlugin';

/**
 * Attaches to events emitted by FeedService and updates online status for users
 * based on those events.
 */
@injectable()
export class UserSessionFeedServicePlugin
  extends AbstractFeedServicePlugin {

  protected userSessionService: UserSessionServiceInterface;
  private logger: LoggerInterface;
  private feedService: FeedServiceInterface;
  private readonly options: AnyDict


  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(OnlineStatusModule.UserSessionServiceInterface) onlineStatusService: UserSessionServiceInterface,
    @inject(FeedModule.FeedPluginOptions) options: AnyDict
  ) {
    super()
    this.logger = logger;
    this.userSessionService = onlineStatusService
    this.options = options;
  }

  public async attach(feedService: FeedServiceInterface) {
    if (this.feedService) {
      this.logger.warn('UserSessionFeedServicePlugin already attached to FeedService!');
      return;
    }
    this.feedService = feedService;

    if (this.options.setAllOfflineOnStartup) {
      await this.setAllOffline();
    }

    feedService.on(UserFeedEvent.USER_FEED_OPENED, this.onSocketOpened.bind(this));
    feedService.on(UserFeedEvent.USER_FEED_CLOSED, this.onSocketClosed.bind(this));
    feedService.on(UserFeedEvent.CLIENT_MESSAGE, this.onClientMessage.bind(this));
  }

  protected async onSocketOpened(userId: Id, feedId: Id, wentOnline: boolean) {
    await this.userSessionService.startSession(userId, feedId);
  }

  protected async onSocketClosed(userId: Id, feedId: Id, wentOffline: boolean) {
    await this.userSessionService.finishSession(feedId, wentOffline);
  }

  protected async onClientMessage(userId: Id, feedId: Id, clientMessage: ClientMessage) {
    
    if(!clientMessage.type) {
      this.logger.debug('Skipped message')
      return 
    }

    switch(clientMessage.type) {
      case ClientMessageType.SET_DEVICE_INFO: {
        this.logger.info('Registered device: ', clientMessage.deviceType);
        const session = await this.userSessionService.getUserSession(feedId);
        if(session) {
          await this.userSessionService.updateSession(feedId, {
            ...session,
            deviceType: clientMessage.deviceType,
          })
        } else {
          this.logger.debug('Session not found')
        }
        break;
      }
      
      default: {
        this.logger.debug('Skipped message');
        break;
      }
    }
  }

  private async setAllOffline() {
    await this.userSessionService.finishAllSessions();
  }
}
