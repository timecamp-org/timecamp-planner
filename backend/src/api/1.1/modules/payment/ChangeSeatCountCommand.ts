import { inject, injectable } from 'inversify';

import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { PaymentModule } from './PaymentModule';
import { SubscriptionProviderInterface } from './interfaces/SubscriptionProviderInterface';
import { isNumber } from 'lodash';
import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface';
import { ProcessCommunicationInterface } from '../processManager/interfaces/ProcessCommunicationInterface';
import { ControlCommandFactoryInterface } from '../messaging/interfaces/ControlCommandFactoryInterface';
import { OutputInterface } from '../console/OutputInterface';
import { CommandParameters } from '../console/types';

@injectable()
export class ChangeSeatCountCommand implements ConsoleCommandInterface {
  protected processCommunication: ProcessCommunicationInterface;
  protected controlCommandFactory: ControlCommandFactoryInterface;

  constructor(
    @inject(PaymentModule.SubscriptionProviderInterface)
    protected subscriptionProvider: SubscriptionProviderInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    protected organizationProvider: OrganizationProviderInterface
  ) {}

  async execute(params: CommandParameters, out: OutputInterface): Promise<void> {
    try {
      const [organizationId, newSeatCount] = process.argv.slice(3);

      if (!isNumber(newSeatCount)) {
        throw new Error(`New seat count ${newSeatCount} is not a number ! `);
      }

      if (newSeatCount < 0) {
        throw new Error('New seat count cannot be less than 0');
      }

      const organization = await this.organizationProvider.getOrganization(organizationId);

      if (!organization) {
        throw new Error('Organization with such ID does not exist');
      }

      const subscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId);

      if (!subscription) {
        throw new Error('Subscription for chosen organization does not exist');
      }
      const { id, seatCount: oldSeatCount } = subscription;

      console.log(`Changing seat count for Subscription with id ${id} from: ${oldSeatCount} to ${newSeatCount}`);
      await this.subscriptionProvider.updateSubscription(id, { seatCount: Number(newSeatCount), organizationId });

      process.exit(0);
    } catch (error) {
      out.print(`Could not send command: ${error}`);
    } finally {
      out.print('\n');
    }
  }
}
