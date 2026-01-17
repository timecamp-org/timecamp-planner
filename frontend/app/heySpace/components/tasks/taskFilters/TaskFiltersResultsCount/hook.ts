import { TaskFiltersResultsCountInterface } from '.';
import { useDataHooksFactory } from './dataHooks';

export interface TaskFiltersResultsCountHookInterface {
  resultsCount: number;
}

export default function useComponent(
  props: TaskFiltersResultsCountInterface
): TaskFiltersResultsCountHookInterface {
  const { useDataProvider } = useDataHooksFactory(
    props.containerType,
    props.targetType
  );

  const { resultsCount } = useDataProvider(props);

  return {
    resultsCount,
  };
}
