export type AbstractItemWithOrder = {
  id: string,
  order: number,
}

export function compareItemsOrder<T extends AbstractItemWithOrder>(a: T, b: T): number {
  if (a.order === b.order) {
    return (a.id).localeCompare(b.id)
  }

  return a.order - b.order
}