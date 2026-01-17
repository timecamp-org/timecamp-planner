export interface RestServerPluginInterface
{
  /**
   * Plugins just need to return a key that identifies them.
   */
  getKey() : string;
  
  onPluggedIn(): PromiseLike<void>;
  
  onUnplugged(): PromiseLike<void>;
}