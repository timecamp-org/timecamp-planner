import { PaymentAgentDbRow } from '../../db/schema';
import { AgentCode } from '../types';

import { Id } from '../../common/identifier';

export interface AgentProviderInterface {
  getAgent(agentCode: AgentCode, trx?: Transaction): PromiseLike<PaymentAgentDbRow>;
  getAgentById(agentId: Id, trx?: Transaction): PromiseLike<PaymentAgentDbRow>;
}
