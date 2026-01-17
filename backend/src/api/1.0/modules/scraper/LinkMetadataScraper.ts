import { ScraperInterface } from './ScraperInterface';
import * as got from 'got'
import { AnyDict } from '../common/types';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { injectable, inject } from 'inversify';
import { ScraperModule } from './ScraperModule';
import { ScraperOptions } from './types';
import { HttpStatus } from '../../../../infrastructure/enum';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import * as Metascraper from 'metascraper'

@injectable()
export class LinkMetadataScraper implements ScraperInterface {
  private logger: LoggerInterface;
  private options: ScraperOptions;
  private scraperInstance: Metascraper.Scraper;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ScraperModule.ScraperOptions) options: ScraperOptions,
    @inject(ScraperModule.ScraperInstance) scraperInstance: Metascraper.Scraper,
  ) {
    this.logger = logger;
    this.options = options;
    this.scraperInstance = scraperInstance;
  }

  async getMetadata(targetUrl: string, acceptsLanguages?: string): Promise<AnyDict> {
    try {
      this.logger.info(`Will got ${targetUrl}`)
      const { body: html, url } = await got(targetUrl, {
        headers: {
          'Accept-Language': acceptsLanguages || 'en-US',
        },
        timeout: this.options.requestTimeout,
      })
      this.logger.info(`Got html with length ${html.length}`)

      if (html.length > this.options.maxHtmlBodyLength) {
        throw new Error(`Parsed body too large for scraper (url: ${url} length: ${html.length})`)
      }

      return await this.scraperInstance({ html, url })
    } catch (error) {
      if (![HttpStatus.NOT_FOUND, HttpStatus.FORBIDDEN].includes(error.statusCode)) {
        this.logger.error(error)
      }
      return null
    }
  }
}
