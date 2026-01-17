import * as _ from 'lodash';
import { get, isArray, mergeWith, toArray } from 'lodash';
import { AnyDict, Dict, MapOfArrays, Maybe } from '../api/1.0/modules/common/types';
import { ForeignKey, UniqueKey } from '../api/1.0/modules/db/Table';
import { PublicUserDbRow } from '../api/1.0/modules/db/schema';
import { CustomFieldValuesMap } from '../api/1.0/modules/extensions/types';
import { ForeignKey as ForeignKey1_1, UniqueKey as UniqueKey1_1 } from '../api/1.1/modules/db/Table';

export type JsonParserType = (text: string, reviver?: (key: any, value: any) => any) => any;

export const toJson = JSON.stringify;
export const fromJson: JsonParserType = JSON.parse;

export const getStringOrJsonProperty: JsonParserType = (maybeStringifiedJson: string) => {
  let value;
  try {
    value = fromJson(maybeStringifiedJson);
  } catch (error) {
    value = maybeStringifiedJson;
  }
  return value;
};

export namespace NamingConvention {
  class PropertyName {
    public parts: string[];

    constructor(parts: string[]) {
      this.parts = parts;
    }
  }

  export interface ConventionInterface {
    parse(propertyName: string): PropertyName;

    print(propertyName: PropertyName): string;
  }

  export class CamelCaseConvention implements ConventionInterface {
    parse(propertyName: string): PropertyName {
      const parts = propertyName
        .replace(/([A-Z])/g, '^$1')
        .split('^')
        .map((str) => str.toLowerCase());
      return new PropertyName(parts);
    }

    print(propertyName: PropertyName): string {
      return propertyName.parts[0] + propertyName.parts.slice(1).map(upperCaseFirst).join('');
    }
  }

  export class UnderScoreConvention implements ConventionInterface {
    parse(propertyName: string): PropertyName {
      return new PropertyName(propertyName.split('_'));
    }

    print(propertyName: PropertyName): string {
      // As simple as that:
      return propertyName.parts.join('_');
    }
  }

  export class ConventionConverter {
    private src: ConventionInterface;
    private dst: ConventionInterface;
    private reverseConverter: ConventionConverter;

    constructor(src: ConventionInterface, dst: ConventionInterface) {
      this.src = src;
      this.dst = dst;
    }

    reverse() {
      if (!this.reverseConverter) {
        this.reverseConverter = new ConventionConverter(this.dst, this.src);
      }
      return this.reverseConverter;
    }

    convertIdentifier(identifier: string): string {
      return this.dst.print(this.src.parse(identifier));
    }

    convert(payload: any) {
      if (!(_.isPlainObject(payload) || _.isArray(payload))) {
        return payload;
      }

      const copy = _.isPlainObject(payload) ? {} : [];

      const strings = Object.keys(payload);
      for (const propertyName of strings) {
        const dstName = this.convertIdentifier(propertyName);

        copy[dstName] = this.convert(payload[propertyName]);
      }
      return copy;
    }
  }
}

function upperCaseFirst(str: String): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

declare global {
  interface String {
    upperCaseFirst: () => string;
  }
}
String.prototype.upperCaseFirst = function () {
  return upperCaseFirst(this);
};

export enum ErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
}

export function violatesUniqueKey(error: any, key: UniqueKey | UniqueKey1_1): boolean {
  const violated =
    error.code && error.constraint && error.code === ErrorCode.UNIQUE_VIOLATION && error.constraint === key;
  if (violated) {
    // TODO add normal loggerinterface
    console.info(`Unique key violated: ${key}`);
  }
  return violated;
}

export function violatesForeignKey(error: any, key: ForeignKey | ForeignKey1_1): boolean {
  return error.code && error.constraint && error.code === ErrorCode.FOREIGN_KEY_VIOLATION && error.constraint === key;
}

export function getUserNickname(userData: PublicUserDbRow): string {
  return userData.nickname || userData.email.split('@')[0];
}

/**
 * From:
 * {
 *   a: [1, 2],
 *   b: [1, 3],
 * }
 * TO:
 * {
 *   1: [a, b],
 *   2: [a],
 *   3: [b],
 * }
 * @param dict
 */
export function invertDict(dict: Dict<Array<string>>): Dict<Array<string>> {
  const ret: Dict<Array<string>> = {};

  Object.keys(dict).forEach((idx) => {
    dict[idx].forEach((item) => {
      if (!ret[item]) {
        ret[item] = [];
      }
      ret[item].push(idx);
    });
  });

  return ret;
}

export function extractCustomFieldValuesFromData(
  customFieldValuesMap: CustomFieldValuesMap,
  pathToValue: string
): AnyDict {
  return get(customFieldValuesMap, pathToValue, {});
}

export function filterOutEmptyArraysFromMap<T>(mapOfArrays: MapOfArrays<T>): MapOfArrays<T> {
  const newMap = {} as MapOfArrays<T>;
  const keys = Object.keys(mapOfArrays);
  keys.forEach((key) => {
    const array = mapOfArrays[key];
    if (array.length > 0) {
      newMap[key] = array;
    }
  });

  return newMap;
}

export function defaultsDeepPreserveArrays(...args: any[]) {
  const output = {};
  toArray(args)
    .reverse()
    .forEach((item) => {
      mergeWith(output, item, (objectValue, sourceValue) => {
        return isArray(sourceValue) ? sourceValue : undefined;
      });
    });
  return output;
}

export function parseCommaSeparatedQueryField<T>(
  queryParams: AnyDict,
  fieldName: string,
  defaultValue: Maybe<T | T[]>
): T[] {
  const fieldValue = get(queryParams, fieldName, defaultValue);
  if (!fieldValue || fieldValue === '') {
    return [];
  }

  if (isArray(fieldValue)) {
    return fieldValue;
  } else {
    return fieldValue.split(',').map((value) => value.trim());
  }
}
