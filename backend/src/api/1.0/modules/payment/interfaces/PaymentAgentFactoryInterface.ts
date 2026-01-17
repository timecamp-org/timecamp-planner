import { PaymentAgentInterface } from "./PaymentAgentInterface";
import { AgentCode } from "../types";
import { PaymentWebhookInterface } from "./PaymentWebhookInterface";
import { ModelParserInterface } from "./ModelParserInterface";

export interface PaymentAgentFactoryInterface {
  getPaymentAgent(agentCode: AgentCode): PaymentAgentInterface;
  getWebhookAgent(agentCode: AgentCode): PaymentWebhookInterface;
  getModelParser(agentCode: AgentCode): ModelParserInterface;
}
