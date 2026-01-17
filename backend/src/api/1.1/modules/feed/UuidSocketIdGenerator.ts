import { SocketUniqueGeneratorInterface } from "./interfaces/SocketUniqueGeneratorInterface";
import { v4 as uuidv4} from 'uuid';
import { SocketIdType } from "./types";
import * as WebSocket from 'ws'

export class UuidSocketIdGenerator
  implements SocketUniqueGeneratorInterface<SocketIdType>
{
  generateUniqueId(): SocketIdType {
    return uuidv4();
  }

  getAllKeys(sockets: { [p: string]: WebSocket }): SocketIdType[] {
    return Object.keys(sockets);
  }
}
