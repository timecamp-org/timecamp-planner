import { Id } from '../../../common/identifier';

type SubscriptionCancelMailParams = {
  organizationId: Id;
  organizationName: Id;
  agentSubscriptionId: string;
  subscriptionId: Id;
  seatCount: number;
  cancellationIssuerId: Id;
  cancellationIssuerEmail: Id;
  reason?: string;
};

function generateOrganizationSubscriptionCancellationMail({
  organizationId,
  organizationName,
  agentSubscriptionId,
  subscriptionId,
  cancellationIssuerId,
  cancellationIssuerEmail,
  seatCount,
  reason,
}: SubscriptionCancelMailParams) {
  return {
    subject: `Subscription cancellation (org: ${organizationId})`,
    html: `
      <html>
        <body>
          <div>
            <div>agentSubscriptionId: ${agentSubscriptionId}</div>
            <div>seatCount: ${seatCount}</div>
            <div>issuer email: ${cancellationIssuerEmail}</div>
            <div>subscriptionId: ${subscriptionId}</div>
            <div>organizationId: ${organizationId}</div>
            <div>organization name: ${organizationName}</div>
            <div>estimated MRR LOSS: -$${seatCount * 5}</div>
            <div>userId: ${cancellationIssuerId}</div>
            ${reason ? `<div>reason: ${reason}</div>` : ''}
            <img src="https://media3.giphy.com/media/eHLriAvNth5cgBN58b/giphy-downsized.gif" />
          </div>
        </body>
      </html>`,
  };
}

export default generateOrganizationSubscriptionCancellationMail;
