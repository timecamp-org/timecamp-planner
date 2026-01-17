import { Id } from "../../../common/identifier";

type SubscriptionChangeMailParams = {
  organizationId: Id,
  organizationName: Id,
  agentSubscriptionId: string,
  subscriptionId: Id,
  seatCount: number,
  cancellationIssuerId: Id,
  cancellationIssuerEmail: Id,
}

function generateOrganizationSubscriptionCreationMail(
  {
    organizationId,
    organizationName,
    agentSubscriptionId,
    subscriptionId,
    cancellationIssuerId,
    cancellationIssuerEmail,
    seatCount,
  }: SubscriptionChangeMailParams
) {
  return {
    subject: `Subscription creation (org: ${organizationId})`,
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
            <div>userId: ${cancellationIssuerId}</div>
            <img src="https://media.giphy.com/media/MFsqcBSoOKPbjtmvWz/giphy.gif" />
          </div>
        </body>
      </html>`
  }
}

export default generateOrganizationSubscriptionCreationMail
