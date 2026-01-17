import { useInfiniteQuery } from 'react-query';

import { useSelector } from 'common/hooks/useSelector';
import { HeySpaceClient } from 'common/services';
import { flatten } from 'lodash';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

import { GlobalSearchResource } from '../types';

interface SearchQueryInterface {
  query: string;
  resourceType?: GlobalSearchResource;
  searchInArchived?: boolean;
  page?: string;
  signal?: AbortSignal;
}

export const useGlobalSearchQuery = ({ resourceType, query, searchInArchived, signal }: SearchQueryInterface) => {
  const organizationId = useSelector(selectCurrentOrganizationId);

  const searchQuery = useInfiniteQuery({
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 1_000,
    queryKey: ['global-search', query, resourceType, searchInArchived],
    queryFn: ({ pageParam }) =>
      HeySpaceClient.restApiClient.searchItems({
        searchQuery: query,
        entityType: resourceType,
        searchInArchived,
        page: pageParam,
        organizationId,
        signal,
      }),
    getPreviousPageParam: (firstPage) => (firstPage as { nextPage: string })?.nextPage,
    getNextPageParam: (lastPage) => (lastPage as { nextPage?: string })?.nextPage,
  });

  const allData = flatten(searchQuery?.data?.pages.map(({ results }) => results)) ?? [];

  const fetchNextPage = () => {
    if (searchQuery.hasNextPage) {
      searchQuery.fetchNextPage();
    }
  };

  return { ...searchQuery, allData, fetchNextPage };
};
