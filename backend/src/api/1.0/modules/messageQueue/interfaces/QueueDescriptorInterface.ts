import { QueueOptions } from "../types";

export interface QueueDescriptorInterface {
  getName(): string
  getOptions(): QueueOptions
}