import { FetchExternalDataResult } from "../../types";
import { TrelloError, TrelloDataImportJobInterface } from "../types";

export interface TrelloApiErrorHandlerInterface {
  handleError<T>(job: TrelloDataImportJobInterface, error: TrelloError): FetchExternalDataResult<T>
}
