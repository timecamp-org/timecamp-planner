import { AgentCode } from "./types";
import { injectable } from "inversify";
import { PaymentAgentInterface } from "./interfaces/PaymentAgentInterface";
import { PaymentAgentFactoryInterface } from "./interfaces/PaymentAgentFactoryInterface";
import { PaymentWebhookInterface } from "./interfaces/PaymentWebhookInterface";
import { ModelParserInterface } from "./interfaces/ModelParserInterface";

@injectable()
export class PaymentAgentFactory implements PaymentAgentFactoryInterface {
  public getPaymentAgent(agentCode: AgentCode): PaymentAgentInterface {
    throw new Error(`Payment agents are disabled. Requested: ${agentCode}`);
  }

  public getWebhookAgent(agentCode: AgentCode): PaymentWebhookInterface {
    throw new Error(`Payment webhooks are disabled. Requested: ${agentCode}`);
  }

  public getModelParser(agentCode: AgentCode): ModelParserInterface {
    throw new Error(`Payment parsers are disabled. Requested: ${agentCode}`);
  }
}
