import * as Chargebee from 'chargebee';
import { inject, injectable } from 'inversify';
import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';
import { PaymentModule } from '../PaymentModule';
import ChargebeeClientInterface from '../interfaces/ChargebeeClientInterface';
import { PaymentOptions } from '../types';
import {
  ChargebeeCoupon,
  ChargebeeHostedPage,
  ChargebeeInvoice,
  ChargebeeRequestPayload,
  ChargebeeSubscription,
  SubscriptionRenewalEstimate,
} from './types';

@injectable()
export default class ChargebeeClient implements ChargebeeClientInterface {
  private chargebee: typeof Chargebee;
  private options: PaymentOptions;

  constructor(
    @inject(PaymentModule.PaymentClientProvider)
    chargebee: typeof Chargebee,
    @inject(PaymentModule.PaymentOptions)
    options: PaymentOptions
  ) {
    this.chargebee = chargebee;
    this.options = options;
    this.init();
  }

  init() {
    this.chargebee.configure({
      api_key: this.options.providerOptions.apiKey,
      site: this.options.providerOptions.site,
    });
  }

  async checkoutNewHostedPage(requestPayload: ChargebeeRequestPayload): Promise<ChargebeeHostedPage> {
    console.log(
      '🚀 ~ file: ChargebeeClient.ts:41 ~ ChargebeeClient ~ checkoutNewHostedPage ~ requestPayload:',
      requestPayload
    );
    console.log({
      api_key: this.options.providerOptions.apiKey,
      site: this.options.providerOptions.site,
    });
    return new Promise<ChargebeeHostedPage>((resolve, reject) => {
      this.chargebee.hosted_page.checkout_new(requestPayload).request((error, result) => {
        console.log(
          '🚀 ~ file: ChargebeeClient.ts:47 ~ ChargebeeClient ~ this.chargebee.hosted_page.checkout_new ~ result:',
          result
        );
        if (error) {
          return reject(error);
        }
        if (!result.hosted_page) {
          return reject(new Error('Hosted Page not found'));
        }

        resolve(result.hosted_page);
      });
    });
  }

  async checkoutExistingHostedPage(requestPayload: ChargebeeRequestPayload): Promise<ChargebeeHostedPage> {
    console.log(
      '🚀 ~ file: ChargebeeClient.ts:57 ~ ChargebeeClient ~ checkoutExistingHostedPage ~ requestPayload:',
      requestPayload
    );
    return new Promise<ChargebeeHostedPage>((resolve, reject) => {
      this.chargebee.hosted_page.checkout_existing(requestPayload).request((error, result) => {
        console.log(
          '🚀 ~ file: ChargebeeClient.ts:70 ~ ChargebeeClient ~ this.chargebee.hosted_page.checkout_existing ~ result:',
          result
        );
        if (error) {
          return reject(error);
        }
        if (!result.hosted_page) {
          return reject(new Error('Hosted Page not found'));
        }
        resolve(result.hosted_page);
      });
    });
  }

  async retrieveSubscription(agentSubscriptionId: Id): Promise<ChargebeeSubscription> {
    return new Promise<ChargebeeSubscription>((resolve, reject) => {
      this.chargebee.subscription.retrieve(agentSubscriptionId).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.subscription) {
          return reject(new Error('Subscription not found'));
        }
        resolve(result.subscription);
      });
    });
  }

  async retrieveCoupons(couponIds: Id[]): Promise<ChargebeeCoupon[]> {
    return new Promise<ChargebeeCoupon[]>((resolve, reject) => {
      this.chargebee.coupon
        .list({
          'id[in]': couponIds,
        })
        .request((error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result.list) {
            return reject(new Error('Coupons not found'));
          }
          const copuons = result.list.map((result) => result.coupon);

          resolve(copuons);
        });
    });
  }

  async removeScheduledCancellation(agentSubscriptionId: Id): Promise<ChargebeeSubscription> {
    return new Promise<ChargebeeSubscription>((resolve, reject) => {
      this.chargebee.subscription.remove_scheduled_cancellation(agentSubscriptionId).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.subscription) {
          return reject(new Error('Subscription not found'));
        }
        resolve(result.subscription);
      });
    });
  }

  async cancelSubscription(agentSubscriptionId: Id, params?: AnyDict): Promise<ChargebeeSubscription> {
    return new Promise<ChargebeeSubscription>((resolve, reject) => {
      this.chargebee.subscription.cancel(agentSubscriptionId, params).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.subscription) {
          return reject(new Error('Subscription not found'));
        }
        resolve(result.subscription);
      });
    });
  }

  async updateSubscription(agentSubscriptionId: Id, params?: AnyDict): Promise<ChargebeeSubscription> {
    return new Promise<ChargebeeSubscription>((resolve, reject) => {
      this.chargebee.subscription.update(agentSubscriptionId, params).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.subscription) {
          return reject(new Error('Subscription not found'));
        }
        resolve(result.subscription);
      });
    });
  }

  async retrieveInvoice(agentInvoiceId: Id): Promise<ChargebeeInvoice> {
    return new Promise<ChargebeeInvoice>((resolve, reject) => {
      this.chargebee.invoice.retrieve(agentInvoiceId).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.invoice) {
          return reject(new Error('Invoice not found'));
        }
        resolve(result.invoice);
      });
    });
  }

  async retrieveSubscriptionInvoices(agentSubscriptionId: Id): Promise<ChargebeeInvoice[]> {
    return new Promise<ChargebeeInvoice[]>((resolve, reject) => {
      this.chargebee.invoice
        .list({
          'subscription_id[is]': agentSubscriptionId,
        })
        .request((error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result.list) {
            return reject(new Error('Invoices not found'));
          }
          const invoices = result.list.map((result) => result.invoice);

          resolve(invoices);
        });
    });
  }

  async retrieveInvoicePdf(agentInvoiceId: Id): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.chargebee.invoice.pdf(agentInvoiceId).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.download) {
          return reject(new Error('Invoice not found'));
        }
        resolve(result.download.download_url);
      });
    });
  }

  async retrieveSubscriptionRenewalEstimate(agentSubscriptionId: Id): Promise<SubscriptionRenewalEstimate> {
    return new Promise<SubscriptionRenewalEstimate>((resolve, reject) => {
      this.chargebee.estimate.renewal_estimate(agentSubscriptionId).request((error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result.estimate) {
          return reject(new Error('Estimate not found'));
        }
        resolve(result.estimate);
      });
    });
  }
}
