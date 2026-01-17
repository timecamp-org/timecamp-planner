export type Dict<T> = { [ _: string ]: T }
export type AnyDict = Dict<any>;
export type StringDict = Dict<string>;
export type PropertiesOfType<T, TVal> = {
  [P in keyof T]: T[P] extends TVal ? P : never
}[keyof T];
export type StringPropertiesOf<T> = PropertiesOfType<T, string>;
export type Callback = (error, result) => void
export type Maybe<T> = T | null;
export type PromisesMap<T> = { [P in keyof T]?: Promise<T[P]> | T[P] };

export interface IteratorInterface<T> {
  readonly current : T | undefined;
  next() : void;
  reset() : void;
}

export enum PeriodType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
}

export enum Position {
  TOP = 'top',
  BOTTOM = 'bottom'
}

export type MapOfArrays<T> = {
  [key: string]: Array<T>
}
