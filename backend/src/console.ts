// Import required at top-level by inversify-js package. Don't ask why.. No idea.
import 'reflect-metadata';

import { theKernel as kernel } from './services';
import { ConsoleApplicationInterface } from './api/1.1/modules/console/ConsoleApplicationInterface';
import { ConsoleModule } from './api/1.1/modules/console/ConsoleModule';
import { ParameterFactoryInterface } from './api/1.1/modules/console/ParameterFactoryInterface';

(async () => {
  try {
    const paramFactory = kernel.get<ParameterFactoryInterface>(ConsoleModule.ParameterFactoryInterface);

    const args = process.argv.slice(2);
    const params = paramFactory.parseArgv(args);

    if (params.params.length === 0) {
      throw new Error("No command provided! Use './console.js list' to see all commands");
    }
    const command = params.params.shift();
    // Create server objects
    const consoleApp = kernel.get<ConsoleApplicationInterface>(ConsoleModule.ConsoleApplicationInterface);

    await consoleApp.run(command, params);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
