import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { selectCurrentOrganizationId } from '../../OrganizationsModel/selectors/domain';
import { billingPeriodNames } from '../constants/billingPeriods';
import {
  CouponInterface,
  CouponStatus,
  Coupons,
  InvoiceInterface,
  InvoiceStatus,
  Invoices,
  PlanInterface,
  Plans,
  SubscriptionInterface,
  SubscriptionStatus,
} from '../types';
import {
  selectCoupons,
  selectFreePlanId,
  selectInvoices,
  selectSubscriptionData,
  selectSubscriptionPlans,
} from './domain';

export const activeSubscriptionStatuses = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.IN_TRIAL,
  SubscriptionStatus.NON_RENEWING,
];

export const selectIsBillingEnabled = (): boolean => false;

const emptyMap = Map();

export const selectInvoiceIds = createSelector(
  selectInvoices,
  selectCurrentOrganizationId,
  (invoices: Invoices, organizationId: Id): List<Id> =>
    invoices
      .valueSeq()
      .sort((invoiceA: InvoiceInterface, invoiceB: InvoiceInterface) => {
        if (invoiceA.createdAt && invoiceB.createdAt) {
          return invoiceB.createdAt - invoiceA.createdAt;
        } else if (invoiceB.createdAt) {
          return -1;
        } else {
          return 1;
        }
      })
      .filter((invoice) => invoice.organizationId === organizationId)
      .map((invoice) => invoice.id)
      .toList()
);

// args: invoiceId
export const selectInvoice = createCachedSelector(
  selectInvoices,
  (_, args) => args.invoiceId,
  (invoices: Invoices, invoiceId: Id): InvoiceInterface => invoices.get(invoiceId)
)((_, args) => generateSelectorName(args, ['invoiceId']));

export const selectInvoicesCreatedAt = createSelector(
  selectInvoiceIds,
  selectInvoices,
  (invoiceIds: List<Id>, invoices: Invoices): Map<Id, Date> => {
    let invoicesCreatedAt = emptyMap as Map<Id, Date>;
    invoiceIds.forEach((invoiceId) => {
      invoicesCreatedAt = invoicesCreatedAt.set(invoiceId, invoices.getIn([invoiceId, 'createdAt']));
    });

    return invoicesCreatedAt;
  }
);

export const selectInvoiceNames = createSelector(
  selectInvoiceIds,
  selectInvoices,
  (invoiceIds: List<Id>, invoices: Invoices) => {
    let invoicesCreatedAt = emptyMap as Map<Id, string>;
    invoiceIds.forEach((invoiceId) => {
      invoicesCreatedAt = invoicesCreatedAt.set(invoiceId, invoices.getIn([invoiceId, 'name']));
    });
    return invoicesCreatedAt;
  }
);

export const selectLastChargeTime = createSelector(
  selectInvoiceIds,
  selectInvoicesCreatedAt,
  (invoiceIds: List<Id>, invoicesCreatedAt: Map<Id, Date>): Date => {
    const firstInvoiceId = invoiceIds.first();

    return invoicesCreatedAt.get(firstInvoiceId);
  }
);

// args: invoiceId
export const selectInvoiceCreatedAt = createCachedSelector(selectInvoice, (invoice: InvoiceInterface): number =>
  invoice ? invoice.createdAt : null
)((_, args) => generateSelectorName(args, ['invoiceId']));

export const selectCurrentSubscription = createSelector(
  selectCurrentOrganizationId,
  selectSubscriptionData,
  (organizationId: Id, subscriptionData: Map<Id, SubscriptionInterface>): SubscriptionInterface =>
    subscriptionData.get(organizationId)
);

// args: invoiceId
export const selectInvoicePlanId = createCachedSelector(
  selectInvoice,
  selectCurrentSubscription,
  (invoice: InvoiceInterface, subscription: SubscriptionInterface): Id => {
    if (!invoice || !subscription) {
      return null;
    }
    return subscription.planId;
  }
)((_, args) => generateSelectorName(args, ['invoiceId']));

export const selectCouponIds = createSelector(
  selectCoupons,
  selectCurrentOrganizationId,
  (coupons: Coupons, organizationId: Id): List<Id> =>
    coupons
      .valueSeq()
      .sort((couponA: CouponInterface, couponB: CouponInterface) => {
        if (couponA.validUntil && couponB.validUntil) {
          return couponB.validUntil.getTime() - couponA.validUntil.getTime();
        } else if (couponB.validUntil) {
          return -1;
        } else {
          return 1;
        }
      })
      .filter((couponA) => couponA.organizationId === organizationId)
      .map((coupon) => coupon.id)
      .toList()
);

// args: couponId
export const selectCoupon = createCachedSelector(
  selectCoupons,
  (_, args) => args.couponId,
  (coupons: Coupons, couponId: Id): CouponInterface => coupons.get(couponId)
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponName = createCachedSelector(selectCoupon, (coupon: CouponInterface): string =>
  coupon ? coupon.name : null
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponStatus = createCachedSelector(
  selectCoupon,
  (coupon: CouponInterface): CouponStatus => (coupon ? coupon.status : null)
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponValidUntil = createCachedSelector(
  selectCoupon,
  (coupon: CouponInterface): Date => (coupon ? coupon.validUntil : null)
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponCode = createCachedSelector(selectCoupon, (coupon: CouponInterface): string =>
  coupon ? coupon.code : null
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponDiscountAmount = createCachedSelector(selectCoupon, (coupon: CouponInterface): number =>
  coupon ? coupon.discountAmount : null
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponDiscountPercentage = createCachedSelector(selectCoupon, (coupon: CouponInterface): number =>
  coupon ? coupon.discountPercentage : null
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponDiscountType = createCachedSelector(selectCoupon, (coupon: CouponInterface): string =>
  coupon ? coupon.discountType : null
)((_, args) => generateSelectorName(args, ['couponId']));

// args: couponId
export const selectCouponDurationMonth = createCachedSelector(selectCoupon, (coupon: CouponInterface): number =>
  coupon ? coupon.durationMonth : null
)((_, args) => generateSelectorName(args, ['couponId']));

export const selectPlanNames = createSelector(selectSubscriptionPlans, (plans: Plans): Map<Id, string> => {
  let planNames = emptyMap as Map<Id, string>;

  plans.forEach((plan) => {
    planNames = planNames.set(plan.id, plan.name);
  });

  return planNames;
});

export const selectPlansCostPerSeat = createSelector(selectSubscriptionPlans, (plans: Plans): Map<Id, number> => {
  let plansCostPerSeat = emptyMap as Map<Id, number>;
  plans.forEach((plan) => {
    plansCostPerSeat = plansCostPerSeat.set(plan.id, plan.costPerSeat);
  });

  return plansCostPerSeat;
});

// args: invoiceId
export const selectInvoicePlanName = createCachedSelector(
  selectPlanNames,
  selectInvoicePlanId,
  (planNames: Map<Id, string>, planId: Id): string => planNames.get(planId)
)((_, args) => generateSelectorName(args, ['invoiceId']));

// args: invoiceId
export const selectInvoiceAmountPaid = createCachedSelector(selectInvoice, (invoice: InvoiceInterface): number =>
  invoice ? invoice.amountPaid : null
)((_, args) => generateSelectorName(args, ['invoiceId']));

// args: invoiceId
export const selectInvoiceTotal = createCachedSelector(selectInvoice, (invoice: InvoiceInterface): number =>
  invoice ? invoice.total : null
)((_, args) => generateSelectorName(args, ['invoiceId']));

// args: invoiceId
export const selectInvoiceStatus = createCachedSelector(
  selectInvoice,
  (invoice: InvoiceInterface): InvoiceStatus => (invoice ? invoice.status : null)
)((_, args) => generateSelectorName(args, ['invoiceId']));

// args: invoiceId
export const selectInvoiceQuantity = createCachedSelector(selectInvoice, (invoice: InvoiceInterface): number =>
  invoice ? invoice.quantity : null
)((_, args) => generateSelectorName(args, ['invoiceId']));

export const selectCurrentSubscriptionPlanId = createSelector(
  selectCurrentSubscription,
  selectFreePlanId,
  (subscription: SubscriptionInterface, freePlanId: Id): Id => {
    if (subscription && subscription.planId && activeSubscriptionStatuses.includes(subscription.status)) {
      return subscription.planId;
    }
    return freePlanId;
  }
);

export const selectCurrentSubscriptionPlanCode = createSelector(
  selectCurrentSubscription,
  selectFreePlanId,
  selectSubscriptionPlans,
  (subscription: SubscriptionInterface, freePlanId: Id, plans: Plans): string => {
    let plan: PlanInterface;

    if (subscription?.planId && activeSubscriptionStatuses.includes(subscription.status)) {
      plan = plans.get(subscription.planId);
    } else {
      plan = plans.get(freePlanId);
    }

    return plan && plan.planCode.trim();
  }
);

export const selectIsCurrentSubscriptionActive = createSelector(
  selectCurrentSubscription,
  (subscription: SubscriptionInterface): boolean => {
    if (subscription && subscription.planId) {
      return activeSubscriptionStatuses.includes(subscription.status);
    }
    return true;
  }
);

export const selectCurrentSubscriptionExpireTime = createSelector(
  selectCurrentSubscription,
  (subscription): number => subscription?.expiresAt
);

export const selectCurrentSubscriptionStatus = createSelector(
  selectCurrentSubscription,
  (subscription): SubscriptionStatus => subscription?.status || SubscriptionStatus.ACTIVE
);

export const selectIsCurrentSubscriptionTrial = createSelector(
  selectCurrentSubscriptionStatus,
  (status): boolean => status === SubscriptionStatus.IN_TRIAL
);

export const selectCurrentSubscriptionSeatCount = createSelector(
  selectCurrentSubscription,
  (subscription): number => subscription?.seatCount
);

export const selectCurrentSubscriptionAgentId = createSelector(
  selectCurrentSubscription,
  (subscription): Id => subscription?.agentSubscriptionId
);

export const selectCurrentSubscriptionBillingPeriodName = createSelector(
  selectCurrentSubscription,
  (subscription): string => subscription && billingPeriodNames[subscription.billingPeriod]
);

export const selectCurrentSubscriptionUpdatedAt = createSelector(
  selectCurrentSubscription,
  (subscription): number => subscription?.updatedAt
);

export const selectCurrentSubscriptionNextBillingAmount = createSelector(
  selectCurrentSubscription,
  (subscription): number => subscription?.nextBillingAmount
);

export const selectCurrentSubscriptionPlanName = createSelector(
  selectCurrentSubscriptionPlanId,
  selectPlanNames,
  (planId: Id, planNames: Map<Id, string>): string => planNames.get(planId)
);

export const selectCurrentSubscriptionCostPerSeat = createSelector(
  selectCurrentSubscriptionPlanId,
  selectPlansCostPerSeat,
  (planId: Id, plansCostPerSeat: Map<Id, number>) => plansCostPerSeat.get(planId)
);

export const selectIsCurrentSubscriptionFree = createSelector(
  selectCurrentSubscriptionCostPerSeat,
  (costPerSeat: number): boolean => costPerSeat === 0
);

export const selectIsCurrentSubscriptionCustom = createSelector(
  selectCurrentSubscriptionAgentId,
  selectIsCurrentSubscriptionFree,
  (agentSubscriptionId: Id, isFree: boolean): boolean => !agentSubscriptionId && !isFree
);

export const selectIsCurrentSubscriptionInternalTrial = createSelector(
  selectIsCurrentSubscriptionCustom,
  selectIsCurrentSubscriptionTrial,
  (isCustom: boolean, isTrial: boolean) => isCustom && isTrial
);

export const selectIsCurrentSubscriptionLifetime = createSelector(
  selectIsCurrentSubscriptionCustom,
  selectCurrentSubscriptionExpireTime,
  (isCustom: boolean, expireTime: number): boolean => isCustom && !expireTime
);

export const selectIsTrialAvaliable = createSelector(
  selectCurrentSubscription,
  selectIsCurrentSubscriptionCustom,
  (currentSubscription: SubscriptionInterface, isCurrentSubscriptionCustom: boolean): boolean => {
    if (currentSubscription) {
      return !isCurrentSubscriptionCustom && currentSubscription.status !== SubscriptionStatus.CANCELLED;
    }
    return true;
  }
);

// This value doesn't include any discounts from chargebee
export const selectCurrentMonthBill = createSelector(
  selectCurrentSubscriptionSeatCount,
  selectCurrentSubscriptionCostPerSeat,
  selectIsCurrentSubscriptionFree,
  selectIsCurrentSubscriptionLifetime,
  selectIsCurrentSubscriptionTrial,
  (seatCount: number, costPerSeat: number, isFree: boolean, isLifetime: boolean, isTrial: boolean) =>
    isLifetime || isFree || isTrial ? 0 : seatCount * costPerSeat
);

export const selectIsCurrentSubscriptionActiveWithoutTrial = createSelector(
  selectIsCurrentSubscriptionActive,
  selectIsCurrentSubscriptionTrial,
  (isActive: boolean, isTrial: boolean): boolean => isActive && !isTrial
);
