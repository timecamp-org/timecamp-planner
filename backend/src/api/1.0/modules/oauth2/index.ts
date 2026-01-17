import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OAuth2Module } from './OAuth2Module';
import * as oAuth2Server from 'oauth2-server'
import { OAuthDataProviderInterface } from './interfaces/OAuthDataProviderInterface';
import { OAuthDataProvider } from './OAuthDataProvider';
import { AuthorizationModelInterface } from './interfaces/AuthorizationModelInterface';
import { PostgresqlAuthorizationModel } from './PostgresqlAuthorizationModel';
import { get } from 'lodash'
import { OAuth2ProviderServiceInterface } from './interfaces/OAuth2ProviderServiceInterface';
import { OAuth2ProviderService } from './OAuth2ProviderService';

export const oAuth2Module : ModuleLoaderType = (kernel, config) => {
  kernel.bind<AuthorizationModelInterface>(OAuth2Module.AuthorizationModelInterface).to(PostgresqlAuthorizationModel)
  kernel.bind<OAuthDataProviderInterface>(OAuth2Module.OAuthDataProviderInterface).to(OAuthDataProvider)
  kernel.bind<OAuth2ProviderServiceInterface>(OAuth2Module.OAuth2ProviderServiceInterface).to(OAuth2ProviderService)

  kernel.bind(OAuth2Module.OAuth2Server).toDynamicValue((ctx) => {
    const accessTokenModel = ctx.container.get<AuthorizationModelInterface>(OAuth2Module.AuthorizationModelInterface);
    return new oAuth2Server({
      model: accessTokenModel,
      authenticateHandler,
      allowEmptyState: true,
    })
  })
}

const authenticateHandler = {
  handle: function(request, response) {
    const id = get(request, 'heyspace.authResult.userId')
    if (id) {
      return {
        id
      }
    } else {
      return null
    }
  }
};
