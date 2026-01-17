import { AbstractNotificationHandler } from './AbstractNotificationHandler';
import { NotificationAction, NotificationPayload } from '../../db/types';
import { inject, injectable } from 'inversify';
import { NotificationsModule } from '../NotificationsModule';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import Table from '../../db/Table';
import { ProjectsModule } from '../../projects/ProjectsModule';
import { ProjectServiceInterface } from '../../projects/interfaces/ProjectServiceInterface';

@injectable()
export class ConversationMessageNotificationHandler
  extends AbstractNotificationHandler
{

  constructor(
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(ProjectsModule.ProjectServiceInterface) protected projectService: ProjectServiceInterface,
  ) {
    super(
      notificationFactory,
      Table.MESSAGE_CONTAINER_PROJECT,
      NotificationAction.INSERT
    );
  }

  public async handle(payload: NotificationPayload): Promise<void>
  {
    const [messageId, projectId] = this.parseNotificationIds(payload.id);
    const project = await this.projectService.getProject(projectId);

    if (project) {
      await this.notificationFactory.createNotificationConversationMessageSent(messageId, project)
    }
  }

}
