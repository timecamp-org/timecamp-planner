/* eslint-disable @typescript-eslint/unbound-method */

import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { HeySpaceClient } from 'common/services';
import { compareNumbers } from 'common/utils/sort';
import { SortOrder } from 'models/component/FiltersModel/types';

import { ProjectTemplateInterface } from '../types';

const fetchSortedTemplates = async () => {
  const templates = await HeySpaceClient.restApiClient.getTemplates();

  templates.forEach((template) => {
    template.taskListTemplates.sort((a, b) => compareNumbers(a.order, b.order, SortOrder.ASC));
  });

  return templates;
};

export const useTemplateData = () => {
  const getTemplatesQuery = useQuery({
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    keepPreviousData: true,
    queryKey: ['project-templates'],
    queryFn: fetchSortedTemplates,
  });

  const templatesByAccess = useMemo(
    () =>
      getTemplatesQuery.data?.reduce(
        (acc, template) => {
          // eslint-disable-next-line no-unused-expressions
          template?.organizationId ? acc.organizationTemplates.push(template) : acc.globalTemplates.push(template);

          return acc;
        },
        { globalTemplates: [] as ProjectTemplateInterface[], organizationTemplates: [] as ProjectTemplateInterface[] }
      ),
    [getTemplatesQuery.data]
  );

  return {
    isLoading: getTemplatesQuery.isLoading,
    allTemplates: getTemplatesQuery.data,
    ...templatesByAccess,
  };
};
