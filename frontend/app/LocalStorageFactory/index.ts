import { ClearCallback, GetItemCallback, KeyCallback, RemoveItemCallback, SetItemCallback } from "./AsyncLocalStorageInterface";

class AsyncWebLocalStorage implements AsyncWebLocalStorage {

  clear(callback: ClearCallback) {
    try {
      localStorage.clear()
      callback(null)
    } catch (error) {
      callback(error)
    }
  }
  getItem(keyName: string, callback: GetItemCallback) {
    try {
      const result = localStorage.getItem(keyName)
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  }
  key(index: number, callback: KeyCallback) {
    try {
      const result = localStorage.key(index)
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  }
  removeItem(keyName: string, callback: RemoveItemCallback) {
    try {
      localStorage.removeItem(keyName)
      callback(null)
    } catch (error) {
      callback(error)
    }
  }
  setItem(keyName: string, keyValue: string, callback: SetItemCallback) {
    try {
      localStorage.setItem(keyName, keyValue)
      callback(null)
    } catch (error) {
      callback(error)
    }
  }
}

let storage = null

export default function getLocalStorage(): AsyncWebLocalStorage {
  if (process.env.STORYBOOK_DEVICE === 'browser') {
    storage = new AsyncWebLocalStorage()
    return storage
  } else {
    if (storage) {
      return storage
    }
    try {
      storage = require('../HeySpaceMobile/localStorage').default
      return storage
    } catch (error) {
      if (console && console.error) {
        console.error(error)
      }
      throw new Error('React native local storage not found')
    }
  }
}
