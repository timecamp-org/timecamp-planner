import { FetchExternalDataResult, WorkerHandleResult } from '../types'

export interface DataImportSubWorkerInterface<T, TExternalData, TParsedData> {
  supports(job: T): PromiseLike<boolean>;

  handle(job: T): PromiseLike<WorkerHandleResult>;

  fetchData(job: T): PromiseLike<FetchExternalDataResult<TExternalData>>;

  filterOutExistingData(externalData: TExternalData, job: T): PromiseLike<TExternalData>;

  parseData(externalData: TExternalData, job: T): TParsedData;

  insertData(parsedData: TParsedData, job: T): PromiseLike<void>;
  
  spawnNewJobs(externalData: TExternalData, job: T): PromiseLike<number>;
}