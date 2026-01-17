import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { PaymentModule } from './PaymentModule';
import { PaymentAgentFactory } from './PaymentAgentFactory';
import { PaymentServiceInterface } from './interfaces/PaymentServiceInterface';
import { PaymentService } from './PaymentService';
import { SubscriptionPlanProviderInterface } from './interfaces/SubscriptionPlanProviderInterface';
import { SubscriptionPlanProvider } from './dataProviders/SubscriptionPlanProvider';
import { AgentProviderInterface } from './interfaces/AgentProviderInterface';
import { AgentProvider } from './dataProviders/AgentProvider';
import { SubscriptionProvider } from './dataProviders/SubscriptionProvider';
import { SubscriptionProviderInterface } from './interfaces/SubscriptionProviderInterface';
import config from '../../../../config';
import { PaymentProviderInterface } from './interfaces/PaymentProviderInterface';
import { PaymentProvider } from './dataProviders/PaymentProvider';
import { SubscriptionFeatureProvider } from './dataProviders/SubscriptionFeatureProvider';
import { SubscriptionFeatureProviderInterface } from './interfaces/SubscriptionFeatureProviderInterface';
import { OrganizationSubscriptionFeatureValidatorInterface } from './interfaces/OrganizationSubscriptionFeatureValidatorInterface';
import { OrganizationSubscriptionFeatureValidator } from './OrganizationSubscriptionFeatureValidator';
import { FeedServicePluginInterface } from '../feed/interfaces/FeedServicePluginInterface';
import { FeedModule } from '../feed/FeedModule';
import { PaymentFeedServicePlugin } from './PaymentFeedServicePlugin';
import { ManualSubscriptionCanellationServiceInterface } from './interfaces/ManualSubscriptionCanellationServiceInterface';
import { ManualSubscriptionCanellationService } from './ManualSubscriptionCanellationService';
import { SubscriptionCancellationProviderInterface } from './interfaces/SubscriptionCancellationProviderInterface';
import { SubscriptionCancellationProvider } from './dataProviders/SubscriptionCancellationProvider';
import { SubscriptionService } from './SubscriptionService';
import { SubscriptionServiceInterface } from './interfaces/SubscriptionServiceInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { SubscriptionPermissions } from './SubscriptionPermissions';
import { ExtensionConfigFoSubscriptionPlanProviderInterface } from './interfaces/ExtensionConfigFoSubscriptionPlanProviderInterface';
import { ExtensionConfigForSubscriptionPlanProvider } from './dataProviders/ExtensionConfigFoSubscriptionPlanProvider';
import { TrialExpiratorCronJob } from './TrialExpiratorCronJob';
import { ChangeSeatCountCommand } from './ChangeSeatCountCommand';
import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface';
import { CommandConfig } from '../console/types';
import { ConsoleModule } from '../console/ConsoleModule';

export const paymentModule: ModuleLoaderType = (kernel) => {
  kernel.bind(PaymentModule.PaymentOptions).toConstantValue(config.payment);

  kernel
    .bind<SubscriptionPlanProviderInterface>(PaymentModule.SubscriptionPlanProviderInterface)
    .to(SubscriptionPlanProvider);
  kernel.bind<AgentProviderInterface>(PaymentModule.AgentProviderInterface).to(AgentProvider);
  kernel.bind<SubscriptionProviderInterface>(PaymentModule.SubscriptionProviderInterface).to(SubscriptionProvider);
  kernel.bind<PaymentProviderInterface>(PaymentModule.PaymentProviderInterface).to(PaymentProvider);
  kernel
    .bind<SubscriptionCancellationProviderInterface>(PaymentModule.SubscriptionCancellationProviderInterface)
    .to(SubscriptionCancellationProvider);
  kernel.bind<SubscriptionServiceInterface>(PaymentModule.SubscriptionServiceInterface).to(SubscriptionService);

  kernel.bind(PaymentModule.PaymentAgentFactory).to(PaymentAgentFactory);
  kernel.bind<PaymentServiceInterface>(PaymentModule.PaymentServiceInterface).to(PaymentService);
  kernel
    .bind<SubscriptionFeatureProviderInterface>(PaymentModule.SubscriptionFeatureProviderInterface)
    .to(SubscriptionFeatureProvider);
  kernel
    .bind<OrganizationSubscriptionFeatureValidatorInterface>(
      PaymentModule.OrganizationSubscriptionFeatureValidatorInterface
    )
    .to(OrganizationSubscriptionFeatureValidator);
  kernel
    .bind<ManualSubscriptionCanellationServiceInterface>(PaymentModule.ManualSubscriptionCanellationServiceInterface)
    .to(ManualSubscriptionCanellationService);
  kernel
    .bind<ExtensionConfigFoSubscriptionPlanProviderInterface>(
      PaymentModule.ExtensionConfigFoSubscriptionPlanProviderInterface
    )
    .to(ExtensionConfigForSubscriptionPlanProvider);

  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface).to(PaymentFeedServicePlugin);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(SubscriptionPermissions);

  kernel.bind<TrialExpiratorCronJob>(PaymentModule.TrialExpiratorCronJob).to(TrialExpiratorCronJob);

  kernel.bind<ConsoleCommandInterface>(PaymentModule.ChangeSeatCountCommand).to(ChangeSeatCountCommand);
  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'payments:change-seat-count',
    description: 'Set mew seat count for payment_in_organization',
    serviceId: PaymentModule.ChangeSeatCountCommand,
  });
};
