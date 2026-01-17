import { useCallback, useState } from 'react';

import { debounce } from 'lodash';

import { GlobalSearchResource } from '../types';

import { useGlobalSearchQuery } from './useGlobalSearch';

let abortController = new AbortController();

type SearchFn = (props: { searchValue: string; resourceType: GlobalSearchResource; searchInArchived: boolean }) => void;

type UseUserInputGlobalSearchType = () => {
  search: SearchFn;
  result: ReturnType<typeof useGlobalSearchQuery>;
};

export const useUserInputGlobalSearch: UseUserInputGlobalSearchType = () => {
  const [queryParams, setQueryParams] = useState({
    query: '',
    resourceType: GlobalSearchResource.MESSAGE,
    searchInArchived: false,
    signal: abortController.signal,
  });

  const debouncedSetQueryParams = useCallback(debounce(setQueryParams, 500), [setQueryParams]);
  const result = useGlobalSearchQuery(queryParams);

  const search = ({ searchValue, resourceType, searchInArchived }) =>
    debouncedSetQueryParams(() => {
      abortController.abort();
      result.remove();

      abortController = new AbortController();

      return {
        query: searchValue,
        resourceType,
        searchInArchived,
        signal: abortController.signal,
      };
    });

  return { result, search };
};
