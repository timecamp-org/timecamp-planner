export type EntityHistory<T> = {
  [P in keyof T]: number
}

export type EntityWithHistory<T> = {
  entityHistory: EntityHistory<T>
}