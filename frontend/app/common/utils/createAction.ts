import { action } from "typesafe-actions";

export const createAction = <T = any>(type: string, payload: T) =>
  action(type, payload || ({} as T));
