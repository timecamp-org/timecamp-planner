import { ManualSubscriptionCanellationServiceInterface } from './interfaces/ManualSubscriptionCanellationServiceInterface'
import { Id } from '../common/identifier'
import {
  CancelOrganizationSubscriptionResult,
  CancelOrganizationSubscriptionStatus,
  OrganizationSubscriptionCancellationStatus,
  SetOrganizationSubscriptionCancellationResult,
  SetOrganizationSubscriptionCancellationStatus,
} from './types'
import { CheckIfUserIsOrganizationAdminStatus } from '../organizations/types'


import { inject, injectable } from 'inversify'
import { UserServiceInterface } from '../users/UserServiceInterface'
import { SubscriptionProviderInterface } from './interfaces/SubscriptionProviderInterface'
import { MailerServiceInterface } from '../mailer/interfaces/MailerServiceInterface'
import { OrganizationsModule } from '../organizations/OrganizationsModule'
import { UsersModule } from '../users/UsersModule'
import { MailerModule } from '../mailer/MailerModule'
import { PaymentModule } from './PaymentModule'
import { SubscriptionCancellationProviderInterface } from './interfaces/SubscriptionCancellationProviderInterface';
import { UserInOrganizationServiceInterface } from '../organizations/interfaces/UserInOrganizationServiceInterface';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { ConnectionInterface } from '../db/ConnectionInterface'
import { DbModule } from '../db/DbModule'

@injectable()
export class ManualSubscriptionCanellationService implements ManualSubscriptionCanellationServiceInterface {

  private userInOrganizationService: UserInOrganizationServiceInterface;
  private OrganizationProvider: OrganizationProviderInterface;
  private userService: UserServiceInterface;
  private subscriptionProvider: SubscriptionProviderInterface;
  private mailerService: MailerServiceInterface;
  private subscriptionCancellationProvider: SubscriptionCancellationProviderInterface;

  constructor(
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    OrganizationProvider: OrganizationProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    userService: UserServiceInterface,
    @inject(PaymentModule.SubscriptionProviderInterface)
    subscriptionProvider: SubscriptionProviderInterface,
    @inject(PaymentModule.SubscriptionCancellationProviderInterface)
    subscriptionCancellationProvider: SubscriptionCancellationProviderInterface,
    @inject(MailerModule.MailerServiceInterface)
    mailerService: MailerServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.userInOrganizationService = userInOrganizationService;
    this.OrganizationProvider = OrganizationProvider;
    this.userService = userService;
    this.subscriptionProvider = subscriptionProvider;
    this.subscriptionCancellationProvider = subscriptionCancellationProvider;
    this.mailerService = mailerService;
  }

  async cancelOrganizationSubscription(organizationId: Id, userId: Id): Promise<CancelOrganizationSubscriptionResult> {
    const { status, userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(userId, organizationId)

    if (status === CheckIfUserIsOrganizationAdminStatus.USER_IN_ORGANIZATION_NOT_FOUND) {
      return {
        status: CancelOrganizationSubscriptionStatus.ORGANIZATION_NOT_FOUND
      }
    }

    if (userIsOrganizationAdmin) {
      const cancellationIssuerPromise = this.userService.getUserById(userId)
      const organizationSubscriptionPromise = this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId)
      const organizationPromise = this.OrganizationProvider.getOrganization(organizationId)

      const [issuer, organizationSubscription, organization] = await Promise.all([
        cancellationIssuerPromise,
        organizationSubscriptionPromise,
        organizationPromise,
      ])

      if (!organization) {
        return {
          status: CancelOrganizationSubscriptionStatus.ORGANIZATION_NOT_FOUND
        }
      }


      await this.setOrganizationSubscriptionCancellationStatus(organizationId, OrganizationSubscriptionCancellationStatus.PENDING)
      this.mailerService.sendOrganizationSubscriptionCancellationMail({
        organizationId,
        organizationName: organization.name,
        subscriptionId: organizationSubscription.id,
        agentSubscriptionId: organizationSubscription.agentSubscriptionId,
        seatCount: organizationSubscription.seatCount,
        issuer,
      })
      return {
        status: CancelOrganizationSubscriptionStatus.OK
      }
    } else {
      return {
        status: CancelOrganizationSubscriptionStatus.USER_IS_NOT_ORGANIZATION_OWNER
      }
    }
  }

  async setOrganizationSubscriptionCancellationStatus(organizationId: Id, status: OrganizationSubscriptionCancellationStatus): Promise<SetOrganizationSubscriptionCancellationResult> {
    return this.connection.getConnection().transaction(async (trx) =>
      this.doSetOrganizationSubscriptionCancellationStatus(trx, organizationId, status)
    )
  }

  async doSetOrganizationSubscriptionCancellationStatus(trx: Transaction, organizationId: Id, status: OrganizationSubscriptionCancellationStatus): Promise<SetOrganizationSubscriptionCancellationResult> {
    try {
      const { id: subscriptionId } = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId, trx)

      await this.subscriptionCancellationProvider.setSubscriptionCancellationRequestStatus(organizationId, subscriptionId, status, trx);

      return {
        status: SetOrganizationSubscriptionCancellationStatus.OK
      }
    } catch (error) {
      throw error
    }
  }

}
