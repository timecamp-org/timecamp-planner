import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OrderModule } from './OrderModule';
import { OrderServiceFactory } from './OrderServiceFactory';
import { OrderServiceFactoryInterface } from './OrderServiceFactoryInterface';

export const orderModule : ModuleLoaderType = kernel => {
  kernel.bind<OrderServiceFactoryInterface>(OrderModule.OrderServiceFactoryInterface).to(OrderServiceFactory);
}
