import { AnyDict } from "../common/types";
import { SentryUserData } from "./types";

export interface SentryClientInterface {
  init(): void;

  setUserContext(userData: SentryUserData): void;

  setExtraContext(context: AnyDict): void;

  captureException(error: Error, userData: SentryUserData, context: AnyDict): void;

  isErrorPermittedToCapture(error: Error): boolean;
}
