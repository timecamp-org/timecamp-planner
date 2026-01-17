import { Id } from '../../../common/identifier';

type SubscriptionChangeMailParams = {
  organizationId: Id;
  organizationName: Id;
  agentSubscriptionId: string;
  subscriptionId: Id;
  seatCount: number;
  prevSeatCount: number;
  issuerId: Id;
  issuerMail: Id;
};

function generateOrganizationSubscriptionDowngradeMail({
  organizationId,
  organizationName,
  agentSubscriptionId,
  subscriptionId,
  issuerId,
  issuerMail,
  prevSeatCount,
  seatCount,
}: SubscriptionChangeMailParams) {
  return {
    subject: `Subscription downgraded :( (org: ${organizationId})`,
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
            <div>estimated MRR LOSS: -$${prevSeatCount * 5 - seatCount * 5}</div>
            <div>userId: ${issuerId}</div>
            <img src="https://i.kym-cdn.com/entries/icons/original/000/026/489/crying.jpg" />
          </div>
        </body>
      </html>`,
  };
}

export default generateOrganizationSubscriptionDowngradeMail;
