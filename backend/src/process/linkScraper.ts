import 'reflect-metadata';

import { theKernel } from '../services';
import { CacheModule } from '../api/1.0/modules/cache/CacheModule';
import { ScraperModule } from '../api/1.0/modules/scraper/ScraperModule';
import config from '../config/config';
import { CacheServiceInterface } from '../api/1.0/modules/cache/interfaces/CacheServiceInterface';
import { ScraperInterface } from '../api/1.0/modules/scraper/ScraperInterface';
import { ProcessEventType } from '../infrastructure/types';

enum MetadataStatus {
  OK,
  NOT_FOUND,
}

const FAILED_REQUEST_TTL = 1000 * 60 * 60;

// TODO: rewrite to use ProcessCommunicationInterface
(async () => {
  const cacheService = theKernel.get<CacheServiceInterface>(CacheModule.CacheServiceInterface);
  const linkMetadataScraper = theKernel.get<ScraperInterface>(ScraperModule.LinkMetadataScraper);

  const onMessage = async (message) => {
    try {
      let result = null;

      if (config.scraper.isScraperEnabled) {
        const { targetUrl, acceptsLanguages } = message.data;
        const cacheKey = `${targetUrl}:${acceptsLanguages}`;
        result = cacheService.get(cacheKey);
        if (!result) {
          const metadata = await linkMetadataScraper.getMetadata(targetUrl, acceptsLanguages);
          if (metadata) {
            result = {
              status: MetadataStatus.OK,
              metadata,
            };
            cacheService.set(cacheKey, result);
          } else {
            result = {
              status: MetadataStatus.NOT_FOUND,
            };
            cacheService.set(cacheKey, result, FAILED_REQUEST_TTL);
          }
        }
      }
      process.send({
        type: message.type,
        data: {
          metadata: result.metadata,
        },
      });
    } catch (error) {
      console.error(error);
      process.send({
        type: message.type,
        data: {
          metadata: null,
        },
      });
    }
  };

  process.on('message', onMessage);

  process.on(ProcessEventType.SIGINT, () => {
    console.log('Received SIGINT. Initiating graceful shutdown...');
    process.exit(0);
  });
})();
