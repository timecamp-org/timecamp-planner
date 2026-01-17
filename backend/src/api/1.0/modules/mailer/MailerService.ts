import { inject, injectable, named } from 'inversify';
import * as nodemailer from 'nodemailer';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { CommonModule } from '../common/CommonModule';
import { UrlGeneratorInterface } from '../common/UrlGenerator';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { MailType, UserDbRow } from '../db/schema';
import { OnlineStatusModule } from '../onlineStatus/OnlineStatusModule';
import { UserSessionServiceInterface } from '../onlineStatus/UserSessionServiceInterface';
import { MailerModule } from './MailerModule';
import { MailerServiceInterface } from './interfaces/MailerServiceInterface';
import generateInvitationMail from './templates/content/generateInvitationMail';
import generateNotificationMail from './templates/content/generateNotificationMail';
import generateOrganizationSubscriptionCancellationMail from './templates/content/generateOrganizationSubscriptionCancellationMail';
import generateOrganizationSubscriptionChangeMail from './templates/content/generateOrganizationSubscriptionChangeMail';
import generateOrganizationSubscriptionCreationMail from './templates/content/generateOrganizationSubscriptionCreationMail';
import generateOrganizationSubscriptionDowngradeMail from './templates/content/generateOrganizationSubscriptionDowngradeMail';
import generateOrganizationSubscriptionUpgradeMail from './templates/content/generateOrganizationSubscriptionUpgradeMail';
import generateResetPasswordMail from './templates/content/generateResetPasswordMail';
import generateSecondTrialExpireMail from './templates/content/generateSecondTrialExpireMail';
import generateWelcomeMail from './templates/content/generateWelcomeMail';
import generateMailHTMLString from './templates/partial/generateMailHTMLString';
import {
  MailingOptions,
  OrganizationSubscriptionCancelMailConfig,
  OrganizationSubscriptionChangeMailConfig,
  SendMailConfig,
} from './types';

@injectable()
export default class MailerService implements MailerServiceInterface {
  private static appEmailAddress = 'planner@timecamp.com';
  private transporter;
  private fallbackTransporter;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(MailerModule.MailingOptions)
    @named('PrimaryMailerConfig')
    smtpConfig: MailingOptions,
    @inject(MailerModule.MailingOptions)
    @named('FallbackMailerConfig')
    fallbackSmtpConfig: MailingOptions,
    @inject(CommonModule.UrlGenerator)
    private readonly urlGenerator: UrlGeneratorInterface,
    @inject(OnlineStatusModule.UserSessionServiceInterface)
    protected onlineStatusService: UserSessionServiceInterface,
    @inject(CommonModule.JsonSerializerInterface)
    protected jsonSerializer: JsonSerializerInterface
  ) {
    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.tls,
      auth: smtpConfig.auth,
    });
    this.fallbackTransporter = nodemailer.createTransport({
      host: fallbackSmtpConfig.host,
      port: fallbackSmtpConfig.port,
      secure: fallbackSmtpConfig.tls,
      auth: fallbackSmtpConfig.auth,
    });
  }

  private async sendMail({
    to,
    subject,
    html,
    from = `Planner <${MailerService.appEmailAddress}>`,
    extraAttachments,
    isFallbackTransporter = false,
  }: SendMailConfig) {
    // setup email data
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    // send mail with defined transport object
    // TODO: move this logic to MailerFactory later
    const transporter = isFallbackTransporter ? this.fallbackTransporter : this.transporter;
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendInvitationMail({ inviter, recipient, organizationName, invitationLink, isResent }) {
    const inviterName = inviter.firstName || inviter.email || 'Someone';

    const { subject, content } = generateInvitationMail({
      urlGenerator: this.urlGenerator,
      inviterName,
      recipientEmail: recipient.email,
      organizationName,
      invitationLink,
    });

    try {
      return await this.sendMail({
        to: this.getRecipientAddress(recipient),
        subject,
        html: content,
        isFallbackTransporter: isResent,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendNotificationMail({ recipient, notificationTitle, notificationContent, notificationCTA }) {
    const { subject, content } = generateNotificationMail({ notificationTitle, notificationContent, notificationCTA });

    try {
      return await this.sendMail({
        to: this.getRecipientAddress(recipient),
        subject,
        html: generateMailHTMLString({
          content,
          recipient: recipient.email,
          urlGenerator: this.urlGenerator,
          showSubscriptionMention: true,
        }),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendResetPasswordMail({ user, resetPasswordToken }) {
    const { subject, content } = generateResetPasswordMail({
      user,
      resetPasswordToken,
      urlGenerator: this.urlGenerator,
    });

    try {
      return await this.sendMail({
        to: this.getRecipientAddress(user),
        subject,
        html: generateMailHTMLString({ content, recipient: user.email, urlGenerator: this.urlGenerator }),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendWelcomeMail(recipient) {
    const { subject, content } = generateWelcomeMail({ recipient, urlGenerator: this.urlGenerator });

    try {
      return await this.sendMail({
        to: this.getRecipientAddress(recipient),
        subject,
        html: content,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendOrganizationSubscriptionCancellationMail(config: OrganizationSubscriptionCancelMailConfig) {
    try {
      const { agentSubscriptionId, organizationId, organizationName, issuer, subscriptionId, seatCount, reason } =
        config;
      const cancellationMail = generateOrganizationSubscriptionCancellationMail({
        agentSubscriptionId,
        cancellationIssuerId: issuer.id,
        cancellationIssuerEmail: issuer.email,
        organizationId,
        organizationName,
        subscriptionId,
        seatCount,
        reason,
      });

      await this.sendMail({
        to: MailerService.appEmailAddress,
        subject: cancellationMail.subject,
        html: cancellationMail.html,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendOrganizationSubscriptionCreationMail(config: OrganizationSubscriptionChangeMailConfig) {
    try {
      const { agentSubscriptionId, organizationId, organizationName, issuer, subscriptionId, seatCount } = config;
      const cancellationMail = generateOrganizationSubscriptionCreationMail({
        agentSubscriptionId,
        cancellationIssuerId: issuer.id,
        cancellationIssuerEmail: issuer.email,
        organizationId,
        organizationName,
        subscriptionId,
        seatCount,
      });

      await this.sendMail({
        to: MailerService.appEmailAddress,
        subject: cancellationMail.subject,
        html: cancellationMail.html,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendOrganizationSubscriptionChangeMail(config: OrganizationSubscriptionChangeMailConfig) {
    try {
      const { agentSubscriptionId, organizationId, organizationName, issuer, subscriptionId, seatCount } = config;
      const mail = generateOrganizationSubscriptionChangeMail({
        agentSubscriptionId,
        issuerId: issuer.id,
        issuerMail: issuer.email,
        organizationId,
        organizationName,
        subscriptionId,
        seatCount,
      });

      await this.sendMail({
        to: MailerService.appEmailAddress,
        subject: mail.subject,
        html: mail.html,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendOrganizationSubscriptionDowngradeMail(config: OrganizationSubscriptionChangeMailConfig) {
    try {
      const {
        agentSubscriptionId,
        organizationId,
        organizationName,
        issuer,
        subscriptionId,
        seatCount,
        prevSeatCount,
      } = config;
      const mail = generateOrganizationSubscriptionDowngradeMail({
        agentSubscriptionId,
        issuerId: issuer.id,
        issuerMail: issuer.email,
        organizationId,
        organizationName,
        subscriptionId,
        seatCount,
        prevSeatCount,
      });

      await this.sendMail({
        to: MailerService.appEmailAddress,
        subject: mail.subject,
        html: mail.html,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async sendOrganizationSubscriptionUpgradeMail(config: OrganizationSubscriptionChangeMailConfig) {
    try {
      const {
        agentSubscriptionId,
        organizationId,
        organizationName,
        issuer,
        subscriptionId,
        seatCount,
        prevSeatCount,
      } = config;
      const mail = generateOrganizationSubscriptionUpgradeMail({
        agentSubscriptionId,
        issuerId: issuer.id,
        issuerMail: issuer.email,
        organizationId,
        organizationName,
        subscriptionId,
        seatCount,
        prevSeatCount,
      });

      await this.sendMail({
        to: MailerService.appEmailAddress,
        subject: mail.subject,
        html: mail.html,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private getRecipientName(recipient: Partial<UserDbRow>): string {
    return `${recipient.firstName ? `${recipient.firstName} ` : ''}${
      recipient.lastName ? `${recipient.lastName} ` : ''
    }`;
  }

  private getRecipientAddress(recipient: Partial<UserDbRow>): string {
    return `${this.getRecipientName(recipient)} <${recipient.email}>`;
  }

  public async sendCustomGeneratedMail(
    recipient: Partial<UserDbRow>,
    mailType: MailType,
    workspaceName?: string
  ): Promise<void> {
    const recipientName = this.getRecipientName(recipient);
    let generateMailContent;
    switch (mailType) {
      case MailType.FIRST_TRIAL_EXPIRE: {
        // generateMailContent = generateFirstTrialExpireMail
        // Temporary disable that mail
        return;
      }
      case MailType.SECOND_TRIAL_EXPIRE: {
        generateMailContent = generateSecondTrialExpireMail;
        break;
      }
      default: {
        throw new Error(`Not implemented mail type: ${mailType}`);
      }
    }
    const { subject, content } = generateMailContent(recipientName, workspaceName);

    try {
      return await this.sendMail({
        to: this.getRecipientAddress(recipient),
        subject,
        html: content,
        sendBrandLogo: false,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
