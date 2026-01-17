import 'reflect-metadata'
import { theKernel } from '../services';
import { MessageQueueInstanceInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueueInstanceInterface';
import { MessageQueueModule } from '../api/1.0/modules/messageQueue/MessageQueueModule';
import { MessageQueuePublisherInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueuePublisherInterface';
import { MessageQueueWorkerInterface } from '../api/1.0/modules/messageQueue/interfaces/MessageQueueWorkerInterface';
import { Message } from 'amqplib';
import { ProjectsModule } from '../api/1.0/modules/projects/ProjectsModule';

(async () => {
  const mqInstance = theKernel.get<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface);
  const publisher = theKernel.get<MessageQueuePublisherInterface>(MessageQueueModule.MessageQueuePublisherInterface);
  const worker = theKernel.get<MessageQueueWorkerInterface<Message>>(
    ProjectsModule.ProjectsWorker,
  );

  await mqInstance.connect();
  await publisher.initialize()
  await worker.initialize()
  await worker.listen()

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Initiating graceful shutdown...');
    publisher.close();
    worker.close();
    mqInstance.disconnect()
    console.log('Worker stopped gracefully')
    process.exit(0);
  })
})()