import {
  InvitationMailConfig,
  NotificationMailConfig,
  OrganizationSubscriptionChangeMailConfig,
  ResetPasswordMailConfig,
  OrganizationSubscriptionCancelMailConfig,
} from '../types'
import { UserDbRow, MailType } from '../../db/schema'

export interface MailerServiceInterface
{
  sendInvitationMail (config: InvitationMailConfig): PromiseLike<void>;

  sendNotificationMail (config: NotificationMailConfig): PromiseLike<void>;

  sendResetPasswordMail (config: ResetPasswordMailConfig): PromiseLike<void>;

  sendWelcomeMail (recipient: Partial<UserDbRow>): PromiseLike<void>;

  sendOrganizationSubscriptionCreationMail(config: OrganizationSubscriptionChangeMailConfig): PromiseLike<void>

  sendOrganizationSubscriptionChangeMail(config: OrganizationSubscriptionChangeMailConfig): PromiseLike<void>

  sendOrganizationSubscriptionDowngradeMail(config: OrganizationSubscriptionChangeMailConfig): PromiseLike<void>

  sendOrganizationSubscriptionUpgradeMail(config: OrganizationSubscriptionChangeMailConfig): PromiseLike<void>

  sendOrganizationSubscriptionCancellationMail(config: OrganizationSubscriptionCancelMailConfig): PromiseLike<void>

  sendCustomGeneratedMail(recipient: Partial<UserDbRow>, mailType: MailType, workspaceName?: string): PromiseLike<void>
}
