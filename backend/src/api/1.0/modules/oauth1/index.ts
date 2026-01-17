import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OAuth1Module } from './OAuth1Module';
import { OAuth1ClientServiceInterface } from './interfaces/OAuth1ClientServiceInterface';
import { OAuth1ClientService } from './OAuth1ClientService';
import { OAuth1Config } from './types';
import { OAuth1AccessTokenProviderInterface } from './interfaces/OAuth1AccessTokenProviderInterface';
import { OAuth1ApiKeyProviderInterface } from './interfaces/OAuth1ApiKeyProviderInterface';
import { OAuth1RequestTokenProviderInterface } from './interfaces/OAuth1RequestTokenProviderInterface';
import { OAuth1ClientProvider } from './providers/OAuth1ClientProvider';
import { OAuth1ClientProviderInterface } from './interfaces/OAuth1ClientProviderInterface';
import { OAuth1AccessTokenProvider } from './providers/OAuth1AccessTokensProvider';
import { OAuth1ApiKeyProvider } from './providers/OAuth1ApiKeyProvider';
import { OAuth1RequestTokenProvider } from './providers/OAuth1RequestTokenProvider';
import { OAuth1Client } from './OAuth1Client';
import { OAuth1ClientInterface } from './interfaces/OAuth1ClientInterface';

export const oAuth1Module : ModuleLoaderType = (kernel, config) => {
  kernel.bind<OAuth1ClientServiceInterface>(OAuth1Module.OAuth1ClientServiceInterface).to(OAuth1ClientService)
  kernel.bind<OAuth1Config>(OAuth1Module.OAuth1Config).toConstantValue(config.oauth1);
  kernel.bind<OAuth1ClientProviderInterface>(OAuth1Module.OAuth1ClientProviderInterface).to(OAuth1ClientProvider)
  kernel.bind<OAuth1AccessTokenProviderInterface>(OAuth1Module.OAuth1AccessTokenProviderInterface).to(OAuth1AccessTokenProvider)
  kernel.bind<OAuth1ApiKeyProviderInterface>(OAuth1Module.OAuth1ApiKeyProviderInterface).to(OAuth1ApiKeyProvider)
  kernel.bind<OAuth1RequestTokenProviderInterface>(OAuth1Module.OAuth1RequestTokenProviderInterface).to(OAuth1RequestTokenProvider)
  kernel.bind<OAuth1ClientInterface>(OAuth1Module.OAuth1ClientInterface).to(OAuth1Client)
}
