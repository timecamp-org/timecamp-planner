import { BotServiceInterface } from './BotServiceInterface'
import { inject, injectable } from 'inversify'
import { BotModule } from './BotModule'
import { AbstractRestServerPlugin } from '../../../../infrastructure/restServer/AbstractRestServerPlugin'

@injectable()
export class BotModuleServerPlugin
  extends AbstractRestServerPlugin
{
  public static readonly PLUGIN_KEY = 'BotModule';
  
  protected botService : BotServiceInterface;
  
  constructor(
    @inject(BotModule.BotServiceInterface)
    botService: BotServiceInterface
  ) {
    super();
    this.botService = botService;
  }

  getKey(): string {
    return BotModuleServerPlugin.PLUGIN_KEY;
  }
}