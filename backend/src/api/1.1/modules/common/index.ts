import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { CommonModule } from './CommonModule';
import { TimeService } from './time/TimeService';
import { IdGenerator, IdGeneratorInterface, Id } from './identifier';
import { DefaultScheduler } from './scheduler/DefaultScheduler';
import { UrlGenerator } from './UrlGenerator';
import { TimeServiceInterface } from './time/TimeServiceInterface';
import { SchedulerInterface } from './scheduler/SchedulerInterface';
import { DateFormatterServiceInterface } from './date/DateFormatterServiceInterface';
import { DateFormatterService } from './date/DateFormatterService';
import config from '../../../../config';
import definitionsConfig from '../../../../config/validationDefinitions.config';
import frontendRoutes from '../../../../config/frontendRoutes.config'
import { getStringOrJsonProperty, JsonParserType } from '../../../../utils';
import { RandomSourceInterface } from './RandonSourceInterface'
import { RandomSource } from './RandomSource'
import { JsonSerializerInterface } from './json/JsonSerializerInterface';
import { JsonSerializer } from './json/JsonSerializer';
import { ValidatorInterface } from './validator/interfaces/ValidatorInterface';
import { Validator } from './validator/Validator';
import { ValidatorDefinitionFactoryInterface } from './validator/interfaces/ValidatorDefinitionFactoryInterface';
import { ValidatorDefinitionFactory } from './validator/ValidatorDefinitionFactory';
import { JoiValidationProvider } from './validator/JoiValidationProvider';

export const commonModule: ModuleLoaderType = kernel =>
{
  kernel.bind<TimeServiceInterface>(CommonModule.TimeServiceInterface).to(TimeService);
  kernel.bind<SchedulerInterface>(CommonModule.SchedulerInterface).to(DefaultScheduler);
  kernel.bind<IdGeneratorInterface<Id>>(CommonModule.IdGeneratorInterface).to(IdGenerator);
  kernel.bind(CommonModule.UrlGenerator).to(UrlGenerator);
  kernel.bind(CommonModule.UrlGeneratorOptions).toConstantValue({
    basePath: config.baseUrl,
    defaultParameters: {},
  });
  kernel.bind(CommonModule.RoutesDictionary).toConstantValue(frontendRoutes);
  kernel.bind<DateFormatterServiceInterface>(CommonModule.DateFormatterServiceInterface).to(DateFormatterService);
  kernel.bind<JsonParserType>(CommonModule.JsonParserType).toConstantValue(getStringOrJsonProperty);
  kernel.bind<RandomSourceInterface>(CommonModule.RandomSourceInterface).to(RandomSource);
  kernel.bind<JsonSerializerInterface>(CommonModule.JsonSerializerInterface).to(JsonSerializer);

  kernel.bind(CommonModule.ValidatorDefinitions).toConstantValue(definitionsConfig);
  kernel.bind<ValidatorDefinitionFactoryInterface>(CommonModule.ValidatorDefinitionFactoryInterface).to(ValidatorDefinitionFactory);
  kernel.bind(CommonModule.ValidationProviderInterface).to(JoiValidationProvider);
  kernel.bind<ValidatorInterface>(CommonModule.ValidatorInterface).to(Validator);
}
