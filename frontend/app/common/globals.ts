import { Store } from 'redux';
import { AnyDict, AppConfigInterface, ApplicationState, FeedConsoleInterface } from './types';

// react-native doesn't have Buffer module
global.Buffer = global.Buffer || require('buffer').Buffer;

// react-native has old JavaScript version that doesnt contain this method
if (!Uint8Array.prototype.slice) {
  Uint8Array.prototype.slice = function slice(start, end) {
    return new Uint8Array(Array.prototype.slice.call(this, start, end));
  };
}

type LiveChatListener = (event: { visibility: 'maximized' | 'minimized' | 'hidden' }) => void;

declare global {
  interface Window {
    LiveChatWidget: {
      call: (key: string, payload?: AnyDict) => void;
      on: (eventType: string, listener: LiveChatListener) => void;
    };
    __tc3_config: AppConfigInterface;
    __tc3_store: Store<ApplicationState>;
    __tc3_feed: FeedConsoleInterface;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: AnyDict;
    __startLogging: VoidFunction;
    __stopLogging: VoidFunction;
    __DEV__: boolean;
    gapi: AnyDict;
    google: AnyDict;
    Calendly: AnyDict;
    location: Location;
    JitsiMeetExternalAPI: JitsiMeetExternalAPI;
  }

  interface JitsiMeetExternalAPI {}
}
