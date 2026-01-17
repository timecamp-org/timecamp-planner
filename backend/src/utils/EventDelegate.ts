import { LoggerInterface } from '../infrastructure/logger'

type ListenerType<EventParams> = (EventParams) => Promise<void>;

export class EventDelegate<EventParams>
{
  protected logger: LoggerInterface;
  protected listeners: ListenerType<EventParams>[];

  constructor(logger: LoggerInterface) {
    this.logger = logger
    this.listeners = [];
  }

  attach(listener: ListenerType<EventParams>) {
    this.listeners.push(listener);
  }

  async triggerEvent(params: EventParams) {
    this.logger.debug(`Triggering event ${params} (${this.listeners.length} listeners)`);
    let triggeredEvents = this.listeners
      .map(listener => (async () =>
          {
            try {
              return await listener(params);
            } catch (e) {
              this.logger.error(e);
            }
          }
        )()
      )
    await Promise.all(triggeredEvents);
  }
}