import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ScraperModule } from './ScraperModule'
import { ScraperInterface } from './ScraperInterface';
import { LinkMetadataScraper } from './LinkMetadataScraper';
import { ScraperOptions } from './types';

export const scraperModule : ModuleLoaderType = (kernel, config) => {
  kernel
    .bind<ScraperOptions>(ScraperModule.ScraperOptions)
    .toConstantValue(config.scraper);

  kernel
    .bind<ScraperOptions>(ScraperModule.ScraperInstance)
    .toConstantValue(require('metascraper')([
      require('metascraper-author')(),
      require('metascraper-description')(),
      require('metascraper-image')(),
      require('metascraper-logo')(),
      require('metascraper-publisher')(),
      require('metascraper-title')(),
      require('metascraper-video')(),
    ]));

  kernel.bind<ScraperInterface>(ScraperModule.LinkMetadataScraper).to(LinkMetadataScraper);
}
