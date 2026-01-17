import { ModuleLoaderType } from '../../ModuleLoaderType'
import RestServer from './RestServer'
import { RestServerModule } from './RestServerModule'
import { Router } from 'express'
import { rootRoutes as rootRoutesV10 } from '../../api/1.0/routes/RootRoute';
import { rootRoutes as rootRoutesV11 } from '../../api/1.1/routes/RootRoute';

import { RestServerPluginInterface } from './RestServerPluginInterface'
import isDev from '../../utils/isDev';

const devPluginKeys = ['ProcessManager']

export const restServerModule: ModuleLoaderType = (kernel, config) => {
  kernel
    .bind<RestServer>(RestServerModule.RestServer)
    .to(RestServer)
    .onActivation((ctx, instance) => {
      let plugins = ctx.container.getAll<RestServerPluginInterface>(RestServerModule.RestServerPlugin);
      if (!isDev()) {
        plugins = plugins.filter(plugin => !(devPluginKeys.includes(plugin.getKey())))
      }
      plugins.forEach(plugin => instance.installPlugin(plugin));
      return instance;
    });

  kernel.bind<Router>(RestServerModule.RoutesV10).toDynamicValue(ctx => rootRoutesV10(ctx.container));
  kernel.bind<Router>(RestServerModule.RoutesV11).toDynamicValue(ctx => rootRoutesV11(ctx.container));

}
