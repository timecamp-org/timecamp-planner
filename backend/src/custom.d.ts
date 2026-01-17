import AuthResult from './api/1.0/modules/authentication/AuthResult';
import { AnyDict, Callback } from './api/1.0/modules/common/types';
import { Knex } from 'knex';

declare class Heyspace {
  authResult?: AuthResult;
}

declare global {
  export namespace Express {
    export interface Request {
      heyspace?: Heyspace;
      clientIp?: string;
    }
  }

  export namespace PM2 {
    export interface Manager {
      connect(cb: Callback): void;
      disconnect(): void;
      start(options: AnyDict, cb: Callback): void;
      stop(process: string, cb: Callback): void;
      delete(process: string, cb: Callback): void;
      describe(process: string, cb: Callback): void;
      launchBus(cb: Callback): void;
      list(cb: Callback): void;
      sendDataToProcessId(processId: number, data: AnyDict, cb: Callback): void;
    }

    export interface Bus extends AnyDict {}
  }

  type Transaction<TRecord extends {} = any, TResult = unknown[]> = Knex.Transaction<TRecord, TResult>;
  type QueryBuilder<TRecord extends {} = any, TResult = unknown[]> = Knex.QueryBuilder<TRecord, TResult>;
  type QueryInterface<TRecord extends {} = any, TResult = unknown[]> = Knex.QueryInterface<TRecord, TResult>;
}
