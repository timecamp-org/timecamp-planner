import { UserDbRow } from "../db/schema";
import { Id } from '../common/identifier'

export type SendMailConfig = {
  to: string,
  subject: string,
  html: string,
  from?: string,
  extraAttachments?: ({
    filename: string,
    path: string,
    cid: string,
  })[],
  sendBrandLogo?: boolean,
  isFallbackTransporter?: boolean,
}

export type InvitationMailConfig = {
  inviter: Partial<UserDbRow>,
  recipient: Partial<UserDbRow>,
  organizationName: string,
  invitationLink: string,
  isResent: boolean,
}

export type NotificationRecipient = {
  firstName?: string,
  lastName?: string,
  email: string
}

export type NotificationMailConfig = {
  recipient: NotificationRecipient,
  notificationTitle?: string,
  notificationContent: string,
  notificationCTA?: {
    caption: string,
    url: string,
  }
}

export type ResetPasswordMailConfig = {
  user: {
    email: string,
    firstName?: string,
    lastName?: string,
  }
  resetPasswordToken: string,
}

export interface OrganizationSubscriptionChangeMailConfig {
  organizationId: Id,
  organizationName: string,
  subscriptionId: Id,
  seatCount: number,
  prevSeatCount?: number,
  agentSubscriptionId: string,
  issuer: Partial<UserDbRow>
}

export interface OrganizationSubscriptionCancelMailConfig extends OrganizationSubscriptionChangeMailConfig {
  reason?: string,
}

export interface MailingOptions {
  host: string,
  port: number,
  tls: boolean,
  auth: MailingAuthOption,
}

export interface MailingAuthOption {
  user: string,
  pass: string,
}
