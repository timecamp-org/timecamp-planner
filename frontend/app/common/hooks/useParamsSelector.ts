import { AnyDict, ApplicationState } from 'common/types';
import { useSelector } from './useSelector';

export const useParamsSelector = <TSelected = unknown, V = AnyDict>(
  selector: (state: ApplicationState, params: V) => TSelected,
  params: V
) => {
  return useSelector((state) => selector(state, params));
};
