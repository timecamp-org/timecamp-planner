import { ControlCommandFactoryInterface } from "./interfaces/ControlCommandFactoryInterface";
import { injectable } from "inversify";
import { ControlCommand, ControlCommandTypes } from "./types";

@injectable()
export class ControlCommandFactory
  implements ControlCommandFactoryInterface
{
  createCommand(commandType: string): ControlCommand {
    switch(commandType) {
      case ControlCommandTypes.RESTART_WEB_APP: {
        return {
          type: commandType,
          data: {},
        }
      }
      default: throw new Error(`Unrecognized ControlCommand type: ${commandType}`)
    }
  }
  
}
