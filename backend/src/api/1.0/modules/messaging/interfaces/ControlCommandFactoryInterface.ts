import { ControlCommand } from "../types";

export interface ControlCommandFactoryInterface
{
  createCommand(commandType: string) : ControlCommand
}
