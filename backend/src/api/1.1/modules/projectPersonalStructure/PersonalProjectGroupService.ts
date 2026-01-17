import { PersonalProjectGroupServiceInterface } from "./interfaces/PersonalProjectGroupServiceInterface";
import { Id } from "../common/identifier";
import {
  CreatePersonalProjectGroupResult,
  CreatePersonalProjectGroupResultStatus,
  DeletePersonalProjectGroupResult,
  DeletePersonalProjectGroupResultStatus, DeleteProjectGroupEventData, ProjectGroupJson,
  UpdatePersonalProjectGroupResult,
  UpdatePersonalProjectGroupResultStatus
} from "./types";
import { inject, injectable } from 'inversify';
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { ProjectPersonalStructureModule } from "./ProjectPersonalStructureModule";
import { PersonalProjectGroupProviderInterface } from "./interfaces/PersonalProjectGroupProviderInterface";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";
import { isEmpty } from "lodash";
import { OrderServiceInterface } from "../order/OrderServiceInterface";
import { OrderModule } from "../order/OrderModule";
import { OrderServiceFactoryInterface } from "../order/OrderServiceFactoryInterface";
import { UserProjectGroupDbRow } from "../db/schema";
import Table from "../db/Table";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";
import { EventDelegate } from "../../../../utils/EventDelegate";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { CommonModule } from "../common/CommonModule";
import { ValidatorInterface } from "../common/validator/interfaces/ValidatorInterface";
import { ValidationDefinitionName, ValidationStatus } from "../common/validator/types";

@injectable()
export class PersonalProjectGroupService
  implements PersonalProjectGroupServiceInterface {

  private orderService: OrderServiceInterface

  public deletePersonalProjectGroupEvent: EventDelegate<DeleteProjectGroupEventData>

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    private orderFactoryService: OrderServiceFactoryInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface)
    private personalProjectGroupProvider: PersonalProjectGroupProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(CommonModule.ValidatorInterface)
    private validator: ValidatorInterface,
  ) {
    this.deletePersonalProjectGroupEvent = new EventDelegate<DeleteProjectGroupEventData>(this.logger);

    this.orderService = this.orderFactoryService.create<UserProjectGroupDbRow>(
      Table.USER_PROJECT_GROUP,
      'userInOrganizationId',
      'order'
    )
  }

  async createPersonalProjectGroup(personalProjectGroup: ProjectGroupJson): Promise<CreatePersonalProjectGroupResult> {
    const connection = this.connection.getConnection()

    return connection.transaction(async (trx) => {
      const {
        order, id, userInOrganizationId,
      } = personalProjectGroup

      const validationResult = await this.validator.validateObject(ValidationDefinitionName.PERSONAL_PROJECT_GROUP, personalProjectGroup);
      if (validationResult.status !== ValidationStatus.OK) {
        this.logger.error(`ValidationError: ${validationResult.message}`)
        return {
          status: CreatePersonalProjectGroupResultStatus.MALFORMED_REQUEST_CONTENT,
          message: validationResult.message,
        }
      }

      await this.orderService.moveItemsToMakeRoomInTheList(trx, id, userInOrganizationId, order)

      const result = await this.personalProjectGroupProvider.createPersonalProjectGroup(personalProjectGroup as UserProjectGroupDbRow, trx)

      return {
        status: CreatePersonalProjectGroupResultStatus.OK,
        groupId: result.id
      }
    })
  }

  async updatePersonalProjectGroup(
    groupId: Id,
    personalProjectGroup: ProjectGroupJson,
  ): Promise<UpdatePersonalProjectGroupResult> {
    const connection = this.connection.getConnection()
    return connection.transaction(async (trx) => {
      const { userInOrganizationId } = await this.personalProjectGroupProvider.getPersonalProjectGroup(groupId, trx)

      if (isEmpty(personalProjectGroup)) {
        return {
          status: UpdatePersonalProjectGroupResultStatus.MISSING_PARAMETER,
        }
      }

      if (personalProjectGroup.order) {
        const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId, trx)
        await this.orderService.moveItemsToMakeRoomInTheList(trx, groupId, userInOrganization.id, personalProjectGroup.order)
      }

      await this.personalProjectGroupProvider.updatePersonalProjectGroup(groupId, personalProjectGroup, trx)

      return {
        status: UpdatePersonalProjectGroupResultStatus.OK,
      }
    })
  }

  async deletePersonalProjectGroup(groupId: Id): Promise<DeletePersonalProjectGroupResult> {
    const connection = this.connection.getConnection()

    return connection.transaction( async (trx) => {
      await this.deletePersonalProjectGroupEvent.triggerEvent({groupId, trx})
      await this.personalProjectGroupProvider.deletePersonalProjectGroup(groupId, trx)

      return {
        status: DeletePersonalProjectGroupResultStatus.OK,
      }
    })
  }

}