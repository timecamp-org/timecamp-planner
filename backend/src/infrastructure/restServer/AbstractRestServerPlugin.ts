import { RestServerPluginInterface } from './RestServerPluginInterface'
import { injectable } from 'inversify'

@injectable()
export abstract class AbstractRestServerPlugin
implements RestServerPluginInterface
{
  abstract getKey() : string;
  
  async onPluggedIn(): Promise<void> {
    // Nothing to do. Override if required.
  }
  
  async onUnplugged(): Promise<void> {
    // Nothing to do. Override if required.
  }
}