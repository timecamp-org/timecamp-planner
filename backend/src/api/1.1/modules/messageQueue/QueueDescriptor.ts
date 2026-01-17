import { QueueOptions } from "./types";
import { QueueDescriptorInterface } from "./interfaces/QueueDescriptorInterface";
import { injectable } from "inversify";

@injectable()
export class QueueDescriptor<T extends string> implements QueueDescriptorInterface {
  constructor(
    private queueName: T, 
    private queueOptions: QueueOptions
    ) {}

  public getName(): T {
    return this.queueName
  }

  public getOptions(): QueueOptions {
    return this.queueOptions
  }
}