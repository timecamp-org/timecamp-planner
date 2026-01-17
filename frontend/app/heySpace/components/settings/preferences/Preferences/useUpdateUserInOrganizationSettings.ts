import { useQueryClient, useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { HeySpaceClient as client } from 'common/services';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { UserInOrganizationSettingsType } from 'models/domain/SettingsModel/types';

interface Params {
  queryId: string;
  settingsType: UserInOrganizationSettingsType;
}

interface UseUpdateUserInOrganizationSettings<T> {
  onSave: (settings: T) => void;
}

export function useUpdateUserInOrganizationSettings<T>({
  queryId,
  settingsType,
}: Params): UseUpdateUserInOrganizationSettings<T> {
  const queryClient = useQueryClient();

  const currentOrganizationId = useSelector(selectCurrentOrganizationId);

  const mutation = useMutation(
    client.restApiClient.updateUserInOrganizationSettings,
    {
      onSuccess: () => {
        // Invalidate and refetch
        // @ts-ignore
        queryClient.invalidateQueries(queryId, {
          settingsType,
          organizationId: currentOrganizationId,
        });
      },
    }
  );

  const onSave = (settings: T) =>
    mutation.mutate({
      settingsType,
      organizationId: currentOrganizationId,
      settings,
    });

  return {
    onSave,
  };
}
