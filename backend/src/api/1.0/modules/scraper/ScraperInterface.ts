import { AnyDict } from '../common/types';

export interface ScraperInterface
{
  getMetadata(targetUrl: string, acceptsLanguages?: string): Promise<AnyDict>;
}
