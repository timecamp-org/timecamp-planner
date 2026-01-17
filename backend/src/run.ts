// Import required at top-level by inversify-js package. Don't ask why.. No idea.
import 'reflect-metadata'

import RestServer from './infrastructure/restServer/RestServer'
import { pgPool } from './api/1.0/modules/db/pg';
import { theKernel as kernel, entryLogger } from './services'
import { RestServerModule } from './infrastructure/restServer/RestServerModule'
import { ProcessEventType } from './infrastructure/types';
import { MessageQueueInstanceInterface } from './api/1.0/modules/messageQueue/interfaces/MessageQueueInstanceInterface';
import { MessageQueueModule } from './api/1.0/modules/messageQueue/MessageQueueModule';
import { MessageQueuePublisherInterface } from './api/1.0/modules/messageQueue/interfaces/MessageQueuePublisherInterface';

const port = process.env.PORT || 3001;

(async () =>
{ // TODO CR to jest zle napisane bo moze byc sytuacja ze feedServer zfailuje a cala aplikacja bedzie dalej chodzic bo restServer jest ok (one musza robic throw ktory nie jest lapany lub emit('error') ktory nie jest handlowany )

  try {
    // Create server objects
    const restServer = kernel.get<RestServer>(RestServerModule.RestServer);
    const mqInstance = kernel.get<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface);
    const mqPublisher = kernel.get<MessageQueuePublisherInterface>(MessageQueueModule.MessageQueuePublisherInterface);

    // Start listening
    await restServer.listen(port);
    entryLogger.info(`Node version: ${process.version}`)
    entryLogger.info(`server is listening on ${port}`)

    try {
      await mqInstance.connect();
      entryLogger.info('MQ Instance is running')
      await mqPublisher.initialize();
      entryLogger.info('MQ Publisher is running')
    } catch(error) {
      entryLogger.error('Failed to run message queue', error)
    }

    process.on(ProcessEventType.SIGINT, exitProcessHandler);

    async function exitProcessHandler(exitCode) {
      entryLogger.info('Pocess got signal to close', exitCode)

      // Stops the server from accepting new connections and finishes existing connections.
      await restServer.close()

      // if error, log and exit with error (1 code)

      entryLogger.info(`Trying to close connections: Total: [${pgPool.totalCount}], Idle: [${pgPool.idleCount}], Waiting: [${pgPool.waitingCount}]`)

      // close database connection and exit with success (0 code)
      pgPool.end(function () {
        entryLogger.info('Pool has drained')
        entryLogger.info('Server closed gracefully!')
        process.exit(0)
      })

    }
  } catch (error) {
    entryLogger.error(error)
    process.exit(1)
  }
})();

process.on('uncaughtException', function(error) {
  entryLogger.error(error)
  process.exit(1);
});
