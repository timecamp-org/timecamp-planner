import { Id } from "../../../common/identifier";

type SubscriptionChangeMailParams = {
  organizationId: Id,
  organizationName: Id,
  agentSubscriptionId: string,
  subscriptionId: Id,
  seatCount: number,
  prevSeatCount: number,
  issuerId: Id,
  issuerMail: Id,
}

function generateOrganizationSubscriptionUpgradeMail(
  {
    organizationId,
    organizationName,
    agentSubscriptionId,
    subscriptionId,
    issuerId,
    issuerMail,
    prevSeatCount,
    seatCount,
  }: SubscriptionChangeMailParams
) {
  return {
    subject: `Subscription upgraded :) (org: ${organizationId})`,
    html: `
      <html>
        <body>
          <div>
            <div>agentSubscriptionId: ${agentSubscriptionId}</div>
            <div>seatCount: ${seatCount}</div>
            <div>issuer email: ${issuerMail}</div>
            <div>subscriptionId: ${subscriptionId}</div>
            <div>organizationId: ${organizationId}</div>
            <div>organization name: ${organizationName}</div>
            <div>estimated MRR GAIN: +$${(seatCount * 5) - (prevSeatCount * 5)}</div>
            <div>userId: ${issuerId}</div>
            <img src="https://pbs.twimg.com/media/DKa3OUtXkAEy3xY.jpg" />
          </div>
        </body>
      </html>`
  }
}

export default generateOrganizationSubscriptionUpgradeMail
