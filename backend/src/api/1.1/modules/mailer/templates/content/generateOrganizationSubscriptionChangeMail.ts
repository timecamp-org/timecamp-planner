import { Id } from "../../../common/identifier";

type SubscriptionChangeMailParams = {
  organizationId: Id,
  organizationName: Id,
  agentSubscriptionId: string,
  subscriptionId: Id,
  seatCount: number,
  issuerId: Id,
  issuerMail: Id,
}

function generateOrganizationSubscriptionChangeMail(
  {
    organizationId,
    organizationName,
    agentSubscriptionId,
    subscriptionId,
    issuerId,
    issuerMail,
    seatCount,
  }: SubscriptionChangeMailParams
) {
  return {
    subject: `Subscription activated! (org: ${organizationId})`,
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
            <div>estimated MRR: +$${seatCount * 5}</div>
            <div>userId: ${issuerId}</div>
            <img src="https://media.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.gif" />
          </div>
        </body>
      </html>`
  }
}

export default generateOrganizationSubscriptionChangeMail
