import { SentryClientOptions, SentryFilter } from "./types";
import { SentryClientInterface } from "./SentryClientInterface";

export default function getSentryClient(config: SentryClientOptions, filters: SentryFilter[]): SentryClientInterface {
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    const SentryNativeClient = require('./SentryNativeClient').default
    try {
      return new SentryNativeClient(config)
    } catch (error) {
      console.log(new Error('Could not import SentryNativeClient'))
    }
  } else {
    try {
      const SentryWebClient = require('./SentryWebClient').default
      return new SentryWebClient(config, filters)
    } catch (error) {
      console.log(new Error('Could not import SentryWebClient'))
    }
  }
}
