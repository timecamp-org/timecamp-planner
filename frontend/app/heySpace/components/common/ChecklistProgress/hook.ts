import { useMemo } from 'react'
import { useDataProvider } from 'commonComponents/ChecklistProgress/dataHooks'
import { ChecklistProgressInterface } from 'commonComponents/ChecklistProgress/index'

export type ChecklistProgressHookInterface = {
  itemsDone: number,
  itemsTotal: number
  progress: number,
  color: string,
}

export default function useComponent(props: ChecklistProgressInterface): ChecklistProgressHookInterface {
  const {
    itemsDone,
    itemsTotal,
    color,
  } = useDataProvider(props.taskId)

  const progress = useMemo(() => calculatePercentageProgress(itemsDone, itemsTotal), [itemsDone, itemsTotal])

  return {
    itemsDone,
    itemsTotal,
    progress,
    color,
  }
}

function calculatePercentageProgress(itemsDone: number, itemsTotal: number): number {
  return (itemsDone / itemsTotal) * 100
}