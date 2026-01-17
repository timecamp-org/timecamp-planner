import { PaymentHookResult, PaymentEventType } from "../types";
import { Request } from "express";
import { NotificationAction } from '../../db/types';

export interface PaymentWebhookInterface {
  handlePaymentEvent(request: Request): PromiseLike<PaymentHookResult>;
  getEventNotificationAction(eventType: string): NotificationAction;
  getPaymentEventType(eventType: string): PaymentEventType;
}
