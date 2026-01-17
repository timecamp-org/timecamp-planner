import { HumanMessage } from '../../HumanMessageModel/models';
import { HumanMessageKind, HumanMessageRecordInterface } from '../../HumanMessageModel/types';
import { i18n } from '../../../../i18n';

export const downgradeErrorMessage = (seatCount: number, subscriptionSeatCount: number): HumanMessageRecordInterface =>
  HumanMessage({
    kind: HumanMessageKind.error,
    text: i18n.t(`No need to reduce the number of seats - first {{subscriptionSeatCount}} seats are on the house!`, {
      subscriptionSeatCount,
    }),
  });

export const tooMuchUsersErrorMessage = (seatCount: number, workspaceUsersSize: number): HumanMessageRecordInterface =>
  HumanMessage({
    kind: HumanMessageKind.error,
    text: i18n.t(
      `You have reached the maximum number of seats in your current subscription. Increase the number of seats or disable additional members in Workspace settings.`
    ),
  });

export const paymentAgentError = (customAgentError: Error): HumanMessageRecordInterface =>
  HumanMessage({
    kind: HumanMessageKind.error,
    text: i18n.t('Failed to get payment page: {{agentError}}', { agentError: customAgentError }),
  });

export const downgradeTooMuchUsersErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Before downgrading subscripion you need to remove some users first.`),
});

export const downgradeTooMuchGuestsErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(`Before downgrading subscripion you need to remove some guests first.`),
});

export const finishPaymentErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t('Something went wrong and we can’t finish checkout. Please try again later.'),
});

export const usersLimitReachedErrorMessage = (
  usersPerWorkspaceLimit: number,
  isCurrentSubscriptionFree: boolean,
  isIOS = false
): HumanMessageRecordInterface => {
  if (isIOS) {
    return HumanMessage({
      kind: HumanMessageKind.error,
      text: i18n.t(`Oops. You have reached the limit of {{usersPerWorkspaceLimit}} users per workspace.`, {
        usersPerWorkspaceLimit,
      }),
    });
  }
  let message = i18n.t(
    `Oops. You have reached the limit of {{usersPerWorkspaceLimit}} users per workspace. Upgrade to Premium to enjoy full features of Planner!`,
    { usersPerWorkspaceLimit }
  );
  if (!isCurrentSubscriptionFree) {
    message = i18n.t(
      `Oops. You have reached the limit of {{usersPerWorkspaceLimit}} users per workspace. Please extend number of seats in your subscription!`,
      { usersPerWorkspaceLimit }
    );
  }
  return HumanMessage({
    kind: HumanMessageKind.error,
    text: message,
  });
};

export const guestsLimitReachedErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t(
    'You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.'
  ),
});

export const noSpacesForGuestErrorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18n.t('You need to assign user to a project first'),
});
