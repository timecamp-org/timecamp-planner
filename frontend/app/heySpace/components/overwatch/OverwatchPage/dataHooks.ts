import { useSelector } from 'common/hooks/useSelector';
import {
  selectIsRequestFinished,
  selectIsRequestRepeatable,
  selectRequestIsLoading,
} from 'models/domain/RequestModel/selectors';
import {
  createViewSettingsWithLinkedSettings,
  getViewSettings,
} from 'models/domain/RequestModel/constants/requestTypes';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectViewSettingsIdsByTypeAndContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewContainerType, ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';
import { onFetchViewSettings } from 'models/domain/ViewSettingsModel/actions';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { useDispatch } from 'react-redux';
import { ModalType } from 'models/component/ModalsModel/types';
import { useCallback } from 'react';
import { List } from 'immutable';
import { Id } from 'common/utils/identifier';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { selectCurrentOrganizationNonDirectProjectsData } from 'models/domain/ProjectsModel/selectors';

export type DataProviderHookInterface = {
  currentOrganizationId: Id;
  isCreateOverwatchViewModalOpen: boolean;
  isOverwatchViewLoading: boolean;
  userHasCreatedOverwatchView: boolean;
  isOverwatchRequestRepeatable: boolean;
  isCreatingOverwatch: boolean;
  viewIds: List<Id>;
  shouldRenderPlaceholder: boolean;
};

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector((state) => selectCurrentOrganizationId(state));
  const isOverwatchViewRequestFinished = useSelector((state) =>
    selectIsRequestFinished(state, {
      requestType: getViewSettings,
      objectId: [ViewSettingsViewType.OVERWATCH, currentOrganizationId],
    })
  );
  const { baseViewSettingsId, linkedViewSettingsIds } = useSelector((state) =>
    selectViewSettingsIdsByTypeAndContainerId(state, {
      viewType: ViewSettingsViewType.OVERWATCH,
      containerId: currentOrganizationId,
      containerType: ViewContainerType.ORGANIZATION,
    })
  );
  const projects = useSelector(selectCurrentOrganizationNonDirectProjectsData);

  return {
    currentOrganizationId,
    isCreateOverwatchViewModalOpen: useSelector((state) =>
      selectIsModalOpen(state, { modalType: ModalType.MANAGE_OVERWATCH_MODAL })
    ),
    isOverwatchViewLoading: !isOverwatchViewRequestFinished,
    isOverwatchRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: getViewSettings,
        objectId: [ViewSettingsViewType.OVERWATCH, currentOrganizationId],
      })
    ),
    isCreatingOverwatch: useSelector((state) =>
      selectRequestIsLoading(state, {
        requestType: createViewSettingsWithLinkedSettings,
        objectId: currentOrganizationId,
      })
    ),
    userHasCreatedOverwatchView: !!baseViewSettingsId,
    viewIds: linkedViewSettingsIds as List<Id>,
    shouldRenderPlaceholder: !projects.size,
  };
};

export type DataPersisterHookInterface = {
  onOpenCreateOverwatchViewModal: VoidFunction;
  onFetchOverwatchViewSettings: (organizationId: Id) => void;
};

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onOpenCreateOverwatchViewModal = useCallback(() => {
    dispatch(onOpenModal(ModalType.MANAGE_OVERWATCH_MODAL));
  }, [dispatch]);

  const onFetchOverwatchViewSettings = useCallback(
    (organizationId: Id) => {
      dispatch(onFetchViewSettings(ViewSettingsViewType.OVERWATCH, ViewContainerType.ORGANIZATION, organizationId));
    },
    [dispatch]
  );

  return {
    onOpenCreateOverwatchViewModal,
    onFetchOverwatchViewSettings,
  };
};
