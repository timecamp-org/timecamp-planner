import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { HeySpaceClient as client } from 'common/services';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { UserInOrganizationSettingsType } from 'models/domain/SettingsModel/types';

interface Params<T> {
  queryId: string;
  settingsType: UserInOrganizationSettingsType;
  onSuccess: (data: T) => void;
}

export function useGetUserInOrganizationSettings<T>({
  queryId,
  settingsType,
  onSuccess,
}: Params<T>): void {
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  useQuery(
    [
      queryId,
      {
        settingsType,
        organizationId: currentOrganizationId,
      },
    ],
    // @ts-ignore
    client.restApiClient.getUserInOrganizationSettings,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess,
    }
  ) as UseQueryResult<T, Error>;
}
