import { CronTabJobInterface } from '../cron/CronTabJobInterface'
import { inject, injectable } from 'inversify'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { OrganizationsModule } from './OrganizationsModule';
import { UserInvitationProviderInterface } from './interfaces/UserInvitationProviderInterface';
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface';
import { UserInvitationDbRow } from '../db/schema';

/**
 * We again send emails to invited users who did not registered
 */

@injectable()
export class InvitationEmailReminderCronJob implements CronTabJobInterface {
  public static readonly KEY = 'invitation-email-reminder'

  invitationDayOffsets = [3, 5]

  protected userInvitationProvider: UserInvitationProviderInterface;
  protected organizationService: OrganizationServiceInterface;

  constructor(
    @inject(OrganizationsModule.UserInvitationProviderInterface) userInvitationProvider: UserInvitationProviderInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface) organizationService: OrganizationServiceInterface,
  ) {
    this.userInvitationProvider = userInvitationProvider
    this.organizationService = organizationService
  }

  getJobKey(): string {
    return InvitationEmailReminderCronJob.KEY;
  }

  async run(logger: LoggerInterface): Promise<void> {
    try {
      logger.debug('Starting...');
      let invitationsToResend: UserInvitationDbRow[] = []

      for (const dayOffset of this.invitationDayOffsets) {
        const numberOfInvitations = this.getNumberOfInvitationsForDays(dayOffset)

        const userInvitations = await this.userInvitationProvider.getNotAcceptedInvitationsWithDayOffsetSentTimes(
          dayOffset,
          numberOfInvitations,
        )

        logger.debug(`Number of invitations to resend after ${dayOffset} days: ${userInvitations.length}`);
        invitationsToResend = invitationsToResend.concat(userInvitations)
      }

      if (invitationsToResend.length === 0) {
        return logger.debug('No invitations to resend');
      }

      logger.debug(`Resending ${invitationsToResend.length} invitations`);

      const updateInvitationCountPromises = invitationsToResend
        .map(userInvitation => {
          userInvitation.invitationCount++
          return this.userInvitationProvider.updateInvitation(userInvitation)
        })

      await Promise.all(updateInvitationCountPromises)

      const mailSendPromises = invitationsToResend
        .map(userInvitation => this.organizationService.prepareAndSendInvitationMail(userInvitation.inviterId, userInvitation.invitedUserId, userInvitation.organizationId))

      Promise.all(mailSendPromises)
    } catch (error) {
      logger.error(error)
    }
  }

  getNumberOfInvitationsForDays(dayOffset: number): number {
    return this.invitationDayOffsets.sort().indexOf(dayOffset) + 1
  }

}
