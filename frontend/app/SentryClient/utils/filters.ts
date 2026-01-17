export interface MaybeWebsocketError extends Error {
  target: WebSocket,
}

export function isEventError(error: MaybeWebsocketError): boolean {
  const isEvent = typeof Event !== 'undefined' && error instanceof Event
  const isWebsocketEvent = typeof WebSocket !== 'undefined' && error.target instanceof WebSocket
  return isEvent || isWebsocketEvent
}
