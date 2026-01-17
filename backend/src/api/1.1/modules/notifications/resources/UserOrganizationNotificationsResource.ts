import { inject, injectable } from 'inversify'
import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource'
import {
  UserOrganizationNotificationsResourceContext,
  UserOrganizationNotificationsResourceData,
  UserOrganizationNotificationsResourceQueryParams
} from '../types'
import { PaginationModule } from '../../pagination/PaginationModule'
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface'
import { PageableQueryParams, StandardPaginatorOptions } from '../../pagination/types'
import { AnyDict } from '../../common/types'
import { QueryModifier } from '../../../../../services/types'
import { getUserOrganizationNotificationsQueryDecorator } from '../queryDecorators'
import { NotificationsModule } from '../NotificationsModule'
import { UserOrganizationNotificationsProviderInterface } from '../interfaces/UserOrganizationNotificationsProviderInterface'
import { NotificationDbRow } from '../../db/schema'

@injectable()
export class UserOrganizationNotificationsResource
  extends AbstractResource<
    UserOrganizationNotificationsResourceQueryParams,
    UserOrganizationNotificationsResourceContext,
    UserOrganizationNotificationsResourceData
    > {

  constructor(
    @inject(PaginationModule.PaginationServiceFactoryInterface)
      paginationServiceFactory: PaginationServiceFactoryInterface,
    @inject(NotificationsModule.UserOrganizationNotificationsProviderInterface)
    private userOrganizationNotificationsProvider: UserOrganizationNotificationsProviderInterface,
  ) {
    super(paginationServiceFactory)
  }

  async getData(
    queryParams: UserOrganizationNotificationsResourceQueryParams,
    context: UserOrganizationNotificationsResourceContext
  ): Promise<UserOrganizationNotificationsResourceData> {
    const { userId, organizationId } = context
    const paginator = super.getPaginator(queryParams, context)
    const queryDecorators = this.getQueryDecorators(queryParams, context)
    const columnNames = this.getColumnNames(queryParams)

    if (paginator !== null) {
      queryDecorators.unshift(paginator.decorate.bind(paginator))
    }

    const notifications = await this.userOrganizationNotificationsProvider.getUserOrganizationNotifications(
      userId,
      organizationId,
      queryDecorators,
      columnNames
    )

    const page = paginator.getPageToken<NotificationDbRow>(notifications)


    return {
      data: notifications,
      page,
    }
  }

  protected getMetadataPromiseForField(field: string, context: UserOrganizationNotificationsResourceContext): PromiseLike<AnyDict> {
    return null
  }

  protected getPaginatorOptions(queryParams: PageableQueryParams): StandardPaginatorOptions {
    const { limit } = queryParams
    return {
      limit,
      columns: ['createdAt', 'id'],
    }
  }

  public getQueryDecorators(queryParams: UserOrganizationNotificationsResourceQueryParams, context: UserOrganizationNotificationsResourceContext): QueryModifier[] {
    const userOrganizationNotificationsDecorator = getUserOrganizationNotificationsQueryDecorator(queryParams)
    return [userOrganizationNotificationsDecorator]
  }

}