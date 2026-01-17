import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import config from '../../../../config';
import { MailerModule } from './MailerModule';
import MailerService from './MailerService';
import { UserMailSentService } from './UserMailSentService';
import { UserMailSentProvider } from './dataProviders/UserMailSentProvider';
import { MailerServiceInterface } from './interfaces/MailerServiceInterface';
import { UserMailSentProviderInterface } from './interfaces/UserMailSentProviderInterface';
import { UserMailSentServiceInterface } from './interfaces/UserMailSentServiceInterface';
import { MailingOptions } from './types';

export const mailerModule: ModuleLoaderType = (kernel) => {
  kernel
    .bind<MailingOptions>(MailerModule.MailingOptions)
    .toConstantValue(config.mailing.primary)
    .whenTargetNamed('PrimaryMailerConfig');
  kernel
    .bind<MailingOptions>(MailerModule.MailingOptions)
    .toConstantValue(config.mailing.fallback)
    .whenTargetNamed('FallbackMailerConfig');
  kernel.bind<MailerServiceInterface>(MailerModule.MailerServiceInterface).to(MailerService).inSingletonScope();
  kernel
    .bind<UserMailSentServiceInterface>(MailerModule.UserMailSentServiceInterface)
    .to(UserMailSentService)
    .inSingletonScope();
  kernel
    .bind<UserMailSentProviderInterface>(MailerModule.UserMailSentProviderInterface)
    .to(UserMailSentProvider)
    .inSingletonScope();
};
