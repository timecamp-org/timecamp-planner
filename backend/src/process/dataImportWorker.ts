import 'reflect-metadata'

import { theKernel } from '../services'
import { MessageQueueInstanceInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueueInstanceInterface'
import { MessageQueueModule } from '../api/1.0/modules/messageQueue/MessageQueueModule'
import { MessageQueuePublisherInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueuePublisherInterface'
import { MessageQueueWorkerInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueueWorkerInterface'
import { Message } from 'amqplib'
import { IntegrationModule } from '../api/1.0/modules/integration/IntegrationModule'

(async () => {
  const mqInstance = theKernel.get<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface);
  const publisher = theKernel.get<MessageQueuePublisherInterface>(MessageQueueModule.MessageQueuePublisherInterface);
  const delayedPublisher = theKernel.get<MessageQueuePublisherInterface>(MessageQueueModule.DelayedMessageQueuePublisherInterface);
  const trelloWorker = theKernel.get<MessageQueueWorkerInterface<Message>>(IntegrationModule.TrelloDataImportWorker)

  await mqInstance.connect()
  await publisher.initialize()
  await delayedPublisher.initialize()
  await trelloWorker.initialize()
  await trelloWorker.listen()

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Initiating graceful shutdown...');
    publisher.close();
    trelloWorker.close();
    mqInstance.disconnect()
    console.log('All workers stopped gracefully')
    process.exit(0);
  })
})()
