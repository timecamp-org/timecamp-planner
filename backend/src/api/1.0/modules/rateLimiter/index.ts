import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { RateLimitModule } from './RateLimiterModule'
import { RateLimitFactory } from './RateLimiterFactory'
import { RateLimitFactoryInterface } from './interfaces/RateLimitFactoryInterface'
import { RateLimitEngineInterface } from './interfaces/RateLimitEngineInterface'
import { RateLimitEngine } from './RateLimitEngine'
import { RateLimitServiceInterface } from './interfaces/RateLimitServiceInterface'
import { RateLimitService } from './RateLimitService'
import { RateLimitConfig } from './types'

export const rateLimitModule: ModuleLoaderType = (kernel, config) => {
  kernel.bind<RateLimitEngineInterface>(RateLimitModule.RateLimitEngine)
    .to(RateLimitEngine)
  kernel.bind<RateLimitFactoryInterface>(RateLimitModule.RateLimitFactoryInterface)
    .to(RateLimitFactory)
  kernel.bind<RateLimitConfig>(RateLimitModule.RateLimitConfig)
    .toConstantValue(config.rateLimiter)
  kernel.bind<RateLimitServiceInterface>(RateLimitModule.RateLimitServiceInterface)
    .to(RateLimitService)
}
