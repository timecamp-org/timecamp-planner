import { LoggerInterface } from '../../../../infrastructure/logger';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { UsersModule } from '../users/UsersModule';
import { FeedMessageType, UserFeedEvent, OnlineStatusMessge, Broadcast } from '../feed/types';
import { inject, injectable } from 'inversify';
import { Id } from '../common/identifier';
import { CommonModule } from '../common/CommonModule';
import { FeedServiceInterface } from '../feed/interfaces/FeedServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { AbstractFeedServicePlugin } from '../feed/AbstractFeedServicePlugin';

@injectable() 
export class UserOnlineFeedPlugin
  extends AbstractFeedServicePlugin {
  protected logger: LoggerInterface;
  protected userService: UserServiceInterface;
  protected timeService: TimeServiceInterface;
  protected feedService: FeedServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(UsersModule.UserServiceInterface) userService: UserServiceInterface,
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
  ) {
    super()
    this.logger = logger;
    this.userService = userService;
    this.timeService = timeService;
  }

  public async attach(feedService: FeedServiceInterface): Promise<void> {
    if (this.feedService) {
      const err = 'Cannot attach plugin to more than one FeedService!'
      this.logger.error(err);
      throw err;
    }
    this.feedService = feedService;

    this.feedService.on(
      UserFeedEvent.USER_ONLINE,
      (userId: Id) => setImmediate(this.onUserOnlineChanged.bind(this, true, userId))
    );
    this.feedService.on(
      UserFeedEvent.USER_OFFLINE,
      (userId: Id) => setImmediate(this.onUserOnlineChanged.bind(this, false, userId))
    );
  }

  async onUserOnlineChanged(isOnline: boolean, userId: Id) {
    this.logger.debug(`User [${userId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
    if (!this.feedService) {
      this.logger.warn('Cannot send online status broadcast -- plugin not attached to FeedService!');
      return;
    }
    const usersFromAllOrganizations = await this.userService.getAllUsersFromOrganizationsForUser(userId);

    const message: OnlineStatusMessge = {
      type: FeedMessageType.ONLINE_STATUS,
      isOnline: isOnline,
      modifiedAt: this.timeService.getCurrentTime(),
      userId,
    };

    const broadcast: Broadcast = {
      message,
      recipients: usersFromAllOrganizations
    }

    this.feedService.broadcast(broadcast);
  }
}
