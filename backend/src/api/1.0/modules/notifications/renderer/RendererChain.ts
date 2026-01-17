import { NotificationContext } from './NotificationContext';
import { NotificationDbRow } from '../../db/schema';
import { ChainableContextInterface } from '../interfaces/ChainableContextInterface';
import { ChainableRendererInterface } from '../interfaces/ChainableRendererInterface';
import { UserServiceInterface } from '../../users/UserServiceInterface';
import { ProjectServiceInterface } from '../../projects/interfaces/ProjectServiceInterface';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { NotificationRendererInterface } from '../interfaces/NotificationRendererInterface';
import { NotificationContent } from '../types';
import { injectable, inject } from 'inversify';
import { ProjectsModule } from '../../projects/ProjectsModule';
import { UsersModule } from '../../users/UsersModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { ListProviderInterface } from '../../lists/interfaces/ListProviderInterface';
import { ListsModule } from '../../lists/ListsModule';

/**
 * RendererChain asks all known ChainableRendererInterface objects
 * for notification content. First returned content is used.
 * If no object returns any content -- log entry is added and no content is returned.
 */
@injectable()
export class RendererChain<T extends NotificationContent>
implements NotificationRendererInterface<T>
{
  protected renderers: ChainableRendererInterface<T>[];
  protected logger: LoggerInterface;
  protected userService: UserServiceInterface
  protected projectService: ProjectServiceInterface
  protected listProvider: ListProviderInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ProjectsModule.ProjectServiceInterface) projectService: ProjectServiceInterface,
    @inject(UsersModule.UserServiceInterface) userService: UserServiceInterface,
    @inject(ListsModule.ListProviderInterface) listProvider: ListProviderInterface,
  ) {
    this.logger = logger
    this.userService = userService;
    this.projectService = projectService;
    this.listProvider = listProvider;
    this.renderers = [];
  }

  /**
   * Renderers are queried in order of addition (chain of command pattern).
   * KEEP THAT IN MIND.
   *
   * @param {ChainableRendererInterface} renderer
   * @return {this}
   */
  public addRenderer(renderer: ChainableRendererInterface<T>): this {
    this.renderers.push(renderer);
    return this;
  }

  /**
   * Alias for addRenderer
   * @param {ChainableRendererInterface} renderer
   * @return {this}
   */
  public add(renderer: ChainableRendererInterface<T>): this {
    return this.addRenderer(renderer);
  }

  /**
   * First renderer to return content is used.
   *
   * @param {NotificationDbRow} notification
   * @return {Promise<NotificationContent>}
   */
  async renderNotification(notification: NotificationDbRow): Promise<T> {
    const context = this.createNotificationContext(notification);
    let content: T;
    for (let i = 0; i < this.renderers.length; i++) {
      content = await this.renderers[i].render(context);
      if (content) {
        this.logger.debug(`Notification content for [${notification.id}]: `, content);
        return content;
      }
    }

    this.logger.debug(`Notification type not supported: [${notification.notificationType}] or conditions not satisfied`);

    return null;
  }

  protected createNotificationContext(notification: NotificationDbRow): ChainableContextInterface {
    return new NotificationContext(
      notification,
      this.userService,
      this.projectService,
      this.listProvider
    );
  }
}
