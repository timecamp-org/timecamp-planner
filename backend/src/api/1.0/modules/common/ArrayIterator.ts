import { IteratorInterface } from './types'

export class ArrayIterator<T> implements IteratorInterface<T> {
  protected array : T[];
  protected index: number;

  constructor(array: T[]) {
    this.array = array;
    this.reset();
  }

  get current(): T | undefined {
    if (this.index < this.array.length) {
      return this.array[this.index];
    }
  }

  next(): void {
    this.index ++;
  }

  reset(): void {
    this.index = 0;
  }
}
