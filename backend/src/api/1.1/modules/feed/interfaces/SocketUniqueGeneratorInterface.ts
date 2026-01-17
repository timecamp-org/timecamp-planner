import * as WebSocket from 'ws'

export interface SocketUniqueGeneratorInterface<IdType extends string | number> {
  generateUniqueId(): IdType
  getAllKeys(sockets: { [p: string]: WebSocket }): IdType[]
}
