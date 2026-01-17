import { v4 as uuidv4, validate } from 'uuid';
import * as getUuidByString from 'uuid-by-string';
import { injectable } from 'inversify';

export type Id = string;
export type IdMap = { [id: string]: Id[] };

export function generateId(): Id {
  return uuidv4();
}

export interface IdGeneratorInterface<T> {
  generateId(): T;

  generateIdByString(str: string): T;

  isValid(value: string): boolean;
}

@injectable()
export class IdGenerator implements IdGeneratorInterface<Id> {
  generateId(): Id {
    return uuidv4();
  }

  generateIdByString(str: string): Id {
    return getUuidByString(str).toLowerCase();
  }

  isValid(value: string): boolean {
    return validate(value);
  }
}
