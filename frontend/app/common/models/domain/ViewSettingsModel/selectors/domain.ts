import { ApplicationState } from 'common/types';
import createImmutableEqualSelector from 'common/utils/createImmutableEqualSelector';
import generateSelectorName from 'common/utils/generateSelectorName';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import {
  ViewContainerType,
  ViewSettingsBodyType,
  ViewSettingsData,
  ViewSettingsRecordInterface,
  ViewSettingsState,
  ViewSettingsViewType,
} from 'models/domain/ViewSettingsModel/types';
import createCachedSelector from 're-reselect';
import { domain } from '../constants';

const emptyList = List();

// domain level selectors
export const selectViewSettingsDomain = (
  state: ApplicationState
): ViewSettingsState => state.get(domain);

export const selectViewsSettingsData = createImmutableEqualSelector(
  selectViewSettingsDomain,
  (domain: ViewSettingsState) =>
    domain.get('viewSettingsData') as ViewSettingsData
);

export const selectViewsSettingsBodyData = createImmutableEqualSelector(
  selectViewSettingsDomain,
  (domain: ViewSettingsState) =>
    domain.get('viewSettingsBody') as Map<Id, ViewSettingsBodyType>
);

export const selectViewsSettingsLinks = createImmutableEqualSelector(
  selectViewSettingsDomain,
  (domain: ViewSettingsState) =>
    domain.get('viewSettingsLinks') as Map<Id, List<Id>>
);

export const selectBaseViewSettingsIdByLinkedViewSettingsIdData =
  createImmutableEqualSelector(
    selectViewSettingsDomain,
    (domain: ViewSettingsState) =>
      domain.get('baseViewSettingsIdByLinkedViewSettingsId') as Map<Id, Id>
  );

// specific selectors
// ViewSettings selectors

// args viewType, containerId, containerType
export const selectViewSettingsIdByTypeAndContainerId = createCachedSelector(
  (_, args) => args.viewType,
  (_, args) => args.containerId,
  (_, args) => args.containerType,
  selectViewsSettingsData,
  (
    viewType: ViewSettingsViewType,
    containerId: Id,
    containerType: ViewContainerType,
    viewSettingsData
  ) => {
    const viewSettings = viewSettingsData.find(
      (viewSettings: ViewSettingsRecordInterface) => {
        const currentViewType = viewSettings.viewType;
        const currentContainerId = viewSettings.containerId;
        const currentContainerType = viewSettings.containerType;

        return (
          currentViewType === viewType &&
          currentContainerId === containerId &&
          containerType === currentContainerType
        );
      }
    );

    return viewSettings ? viewSettings.id : null;
  }
)((_, args) =>
  generateSelectorName(args, ['viewType', 'containerId', 'containerType'])
);

// args containerId, containerType
export const selectViewSettingsIdsByContainerId = createCachedSelector(
  (_, args) => args.containerId,
  (_, args) => args.containerType,
  selectViewsSettingsData,
  (containerId: Id, containerType: ViewContainerType, viewSettingsData) =>
    viewSettingsData
      .valueSeq()
      .filter(
        (viewSettings) =>
          viewSettings.containerId === containerId &&
          viewSettings.containerType === containerType
      )
      .map((viewSettings) => viewSettings.id) as List<Id>
)((_, args) =>
  generateSelectorName(args, ['viewType', 'containerId', 'containerType'])
);

// args viewType, containerId, containerType
export const selectViewSettingsByTypeAndContainerId = createCachedSelector(
  selectViewSettingsIdByTypeAndContainerId,
  selectViewsSettingsData,
  selectViewsSettingsLinks,
  (viewSettingsId, viewSettingsDataDomain, viewSettingsLinks) => {
    if (viewSettingsId) {
      const baseViewSettings = viewSettingsDataDomain.get(viewSettingsId);
      const linkedViewSettingsIds = viewSettingsLinks.get(
        viewSettingsId,
        emptyList as List<Id>
      );
      const linkedViewSettings = linkedViewSettingsIds
        .map((linkedViewSettingsId) =>
          viewSettingsDataDomain.get(linkedViewSettingsId)
        )
        .sort(
          (viewSettingsA, viewSettingsB) =>
            viewSettingsA.createdAt - viewSettingsB.createdAt
        );

      return {
        baseViewSettings,
        linkedViewSettings,
      };
    } else {
      return {
        baseViewSettings: null,
        linkedViewSettings: null,
      };
    }
  }
)((_, args) =>
  generateSelectorName(args, ['viewType', 'containerId', 'containerType'])
);
// args viewType, containerId, containerType
export const selectViewSettingsIdsByTypeAndContainerId = createCachedSelector(
  selectViewSettingsByTypeAndContainerId,
  ({ baseViewSettings, linkedViewSettings }) => {
    return {
      baseViewSettingsId: baseViewSettings ? baseViewSettings.id : null,
      linkedViewSettingsIds: linkedViewSettings
        ? linkedViewSettings.map((viewSettings) => viewSettings.id)
        : emptyList,
    };
  }
)((_, args) =>
  generateSelectorName(args, ['viewType', 'containerId', 'containerType'])
);

// args: viewId
export const selectViewSettingsByViewId = createCachedSelector(
  (_, args) => args.viewId,
  selectViewsSettingsData,
  (viewId, viewSettingsData) => viewSettingsData.get(viewId)
)((_, args) => generateSelectorName(args, ['viewId']));

// args: viewId
export const selectViewSettingsContainerId = createCachedSelector(
  selectViewSettingsByViewId,
  (viewSettings) => (viewSettings ? viewSettings.get('containerId') : null)
)((_, args) => generateSelectorName(args, ['viewId']));

// args: viewId
export const selectViewSettingsContainerType = createCachedSelector(
  selectViewSettingsByViewId,
  (viewSettings) => (viewSettings ? viewSettings.get('containerType') : null)
)((_, args) => generateSelectorName(args, ['viewId']));

// args: viewId
export const selectViewSettingsViewType = createCachedSelector(
  selectViewSettingsByViewId,
  (viewSettings) => (viewSettings ? viewSettings.get('viewType') : null)
)((_, args) => generateSelectorName(args, ['viewId']));

// ViewSettingsBody selectors

// args: viewId
export const selectViewSettingsBody = createCachedSelector(
  (_, args) => args.viewId,
  selectViewsSettingsBodyData,
  (viewId, viewSettingsBodyData) => viewSettingsBodyData.get(viewId)
)((_, args) => generateSelectorName(args, ['viewId']));

// args: viewId, fieldName
export const selectViewSettingsBodyField = createCachedSelector(
  (_, args) => args.fieldName,
  selectViewSettingsBody,
  (fieldName, viewSettingsBody) =>
    viewSettingsBody ? viewSettingsBody.get(fieldName) : null
)((_, args) => generateSelectorName(args, ['viewId', 'fieldName']));

// Other specific selector

// args: linkedViewId
export const selectBaseViewSettingsIdByLinkedViewSettingsId =
  createCachedSelector(
    (_, args) => args.linkedViewId,
    selectBaseViewSettingsIdByLinkedViewSettingsIdData,
    (linkedViewId, baseViewSettingsIdByLinkedViewSettingsId) =>
      baseViewSettingsIdByLinkedViewSettingsId.get(linkedViewId)
  )((_, args) => generateSelectorName(args, ['linkedViewId']));

// args: baseViewId
export const selectLinkedViewIdsByBaseViewId = createCachedSelector(
  (_, args) => args.baseViewId,
  selectViewsSettingsLinks,
  (baseViewId, viewSettingsLinks) =>
    viewSettingsLinks.get(baseViewId, emptyList as List<Id>)
)((_, args) => generateSelectorName(args, ['baseViewId']));

// args: baseViewId
export const selectLinkedViewContainerIdsByBaseViewId = createCachedSelector(
  selectLinkedViewIdsByBaseViewId,
  selectViewsSettingsData,
  (linkedViewIds, viewSettingsData) =>
    linkedViewIds.map((viewId) =>
      viewSettingsData.getIn([viewId, 'containerId'])
    ) as List<Id>
)((_, args) => generateSelectorName(args, ['baseViewId']));

// args: baseViewId
export const selectLinkedViewSettingsByBaseViewId = createCachedSelector(
  selectLinkedViewIdsByBaseViewId,
  selectViewsSettingsData,
  (linkedViewIds, viewSettingsData) =>
    linkedViewIds.map((viewId) =>
      viewSettingsData.get(viewId)
    ) as List<ViewSettingsRecordInterface>
)((_, args) => generateSelectorName(args, ['baseViewId']));
