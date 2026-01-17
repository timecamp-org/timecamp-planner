
type MaybeValue = string | null

export type ClearCallback = (error: Error) => void;
export type GetItemCallback = (error: Error, item?: MaybeValue) => void;
export type KeyCallback = (error: Error, item?: MaybeValue) => void;
export type RemoveItemCallback = (error: Error) => void;
export type SetItemCallback = (error: Error) => void;

export interface AsyncWebLocalStorage {
  clear(callback: ClearCallback);
  getItem(keyName: string, callback: GetItemCallback);
  key(index: number, callback: KeyCallback);
  removeItem(keyName: string, callback: RemoveItemCallback);
  setItem(keyName: string, keyValue: string, callback: SetItemCallback);

}
