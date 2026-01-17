import {
  EncodedPaginationToken,
  ComparatorType,
  PaginatedResults,
} from "./types";
import { Maybe } from '../common/types';

type PaginatedResultRow<T> = { row: T, nextPage: EncodedPaginationToken }

export function getComparator(direction: 'asc' | 'desc', columns: string[]): ComparatorType {
  return <T>(a: T, b: T) => {
    for (let columnName of columns) {
      if (a[columnName] !== b[columnName]) {
        return (direction === 'asc' ? 1.0 : -1.0) * (a[columnName] - b[columnName]);
      }
    }
    return 0;
  }
}

export function mergeResults<T>(results: PaginatedResults<T>[], comparator: ComparatorType) {

  const merged: PaginatedResults<T> = { results: [], nextPage: null };

  let lowest = pickLowest(results, comparator);
  merged.nextPage = lowest.nextPage;
  while (lowest !== null) {
    merged.results.push(lowest.row);
    merged.nextPage = lowest.nextPage;
    lowest = pickLowest(results, comparator);
  }

  return merged;
}

export function getLastPage<T>(results: PaginatedResults<T>[], comparator: ComparatorType)
  : EncodedPaginationToken {
  const highestRow = pickHighest(results, comparator);
  return highestRow ? highestRow.nextPage : null;
}

export function pickHighest<T>(
  results: PaginatedResults<T>[],
  comparator: ComparatorType
): PaginatedResultRow<T> {
  let highest: PaginatedResultRow<T> = null;

  for (let result of results) {
    const lastRow = last(result);
    if (highest == null || (lastRow !== null && comparator(lastRow, highest) > 0)) {
      highest = lastRow;
    }
  }

  return highest;
}

export function pickLowest<T>(
  results: PaginatedResults<T>[],
  comparator: ComparatorType
): PaginatedResultRow<T> {
  let lowest = null;
  let resultToPop: PaginatedResults<T> = null;

  for (let result of results) {
    const current = first(result);
    if (lowest === null) {
      resultToPop = result;
      lowest = current;
    } else if (current !== null) {
      if (comparator(current.row, lowest.row) < 0) {
        resultToPop = result;
        lowest = current;
      }
    }
  }

  if (resultToPop) {
    resultToPop.results.shift();
  }

  return lowest;
}

export function first<T>(results: PaginatedResults<T>): Maybe<PaginatedResultRow<T>> {
  return results.results.length > 0
    ? { row: results.results[0], nextPage: results.nextPage }
    : null;
}

export function last<T>(results: PaginatedResults<T>): Maybe<PaginatedResultRow<T>> {
  return results.results.length > 0
    ? { row: results.results[results.results.length - 1], nextPage: results.nextPage }
    : null;
}