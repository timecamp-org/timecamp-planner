import * as WebSocket from 'ws'
import { FeedHandler } from '../api/1.1/controllers/FeedController'
import { injectable, inject } from 'inversify';
import { FeedModule } from '../api/1.1/modules/feed/FeedModule';
/**
 * In order to achieve real-time messaging we have to use websockets
 * and push all message related data through them.
 *
 * When first step is done (messages), we can add more entities to changes feed.
 *
 */
@injectable()
export class FeedServer {
  protected wss: WebSocket.Server;
  private feedController: FeedHandler;

  constructor(
    @inject(FeedModule.FeedHandler) feedController: FeedHandler
  ) {
    this.wss = null;
    this.feedController = feedController
  }

  public listen(port) {
    return new Promise((resolve, reject) => {
      if (this.wss) {
        throw new Error('FeedServer already listening');
      }
      this.wss = new WebSocket.Server({ port });
      // this.wss.shouldHandle = (req : IncomingMessage) => {
      //   return true;
      // }

      this.wss.on('connection', this.feedController.onConnection.bind(this.feedController)); // TODO CR po co tworzyc cala nowa klase na to? wystarczy przekazac funkcje. IMO feedHandler to powinna byc fc
      this.wss.on('listening', resolve);
      this.wss.on('error', reject);
      this.wss.on('headers', this.feedController.onHeaders.bind(this.feedController));
    });
  }

  public close() {
    if (this.wss) {
      this.wss.close()
    }
  }
}
