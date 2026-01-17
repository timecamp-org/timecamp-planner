import urljoin from 'url-join'
import queryString from 'query-string'
import { boundClass } from 'autobind-decorator'

export interface HttpAgentInterface {
  request(url: string, fetchOptions: FetchOptionsInterface, callback: CallableFunction): void
}

export interface FetchOptionsInterface extends RequestInit {
  qs?: object,
}

interface AgentOptionsInterface {
  baseUrl: string,
  overwriteHeaders?: boolean,
}

@boundClass
class HttpAgent implements HttpAgentInterface {

  private agentOptions: AgentOptionsInterface
  private defaultFetchOptions: FetchOptionsInterface

  constructor(agentOptions: AgentOptionsInterface, defaultFetchOptions = {}) {
    this.agentOptions = agentOptions;
    this.defaultFetchOptions = defaultFetchOptions;
  }

  request(url: string, fetchOptions: FetchOptionsInterface, callback: CallableFunction) {
    let fullUrl = urljoin(this.agentOptions.baseUrl, url);
    if (fetchOptions && fetchOptions.qs) {
      fullUrl = `${fullUrl}?${queryString.stringify(fetchOptions.qs)}`;
    }
    const resultingFetchOptions = Object.assign(
      {},
      this.defaultFetchOptions,
      fetchOptions,
    );

    const overwriteHeaders = this.agentOptions.overwriteHeaders;
    if (overwriteHeaders) {
      resultingFetchOptions.headers = Object.assign(
        {},
        overwriteHeaders,
        fetchOptions ? fetchOptions.headers || {} : {},
      );
    }

    fetch(fullUrl, resultingFetchOptions).then( // eslint-disable-line no-undef
      result => {
        if (callback) {
          callback(null, result);
        }
      },
      error => {
        if (callback) {
          callback(error);
        }
      },
    );
  }
}

export default HttpAgent;
