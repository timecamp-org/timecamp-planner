import { messageBuilderFactoryType } from "../types";
import { MessageBuilderInterface } from "./MessageBuilderInterface";

export interface MessageBuilderFactoryInterface
{
  createBuilder(type: messageBuilderFactoryType) : MessageBuilderInterface
}
