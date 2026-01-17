import { List } from 'immutable';

import { Id } from 'common/utils/identifier';
import { AssigneesContainerEntityType } from 'commonComponents/AssigneesController/types';
import { EntityType } from 'models/domain/EntityModel/types';

export type DataProviderHookInterface = {
  projectId: Id;
  color: string;
  assigneeIds: List<Id>;
  isProjectPrivate: boolean;
  projectPeopleIds: List<Id>;
  notAssignedUserIds: List<Id>;
  isCurrentUserOrganizationGuest: boolean;
  currentUserId: Id;
};

export type DataPersisterHookInterface = {
  onAddAssignee: (userId: Id) => void;
  onRemoveAssignee: (userId: Id) => void;
};

export type DataHooksInterface = {
  useDataProvider: (objectId: Id) => DataProviderHookInterface;
  useDataPersister: (objectId: Id) => DataPersisterHookInterface;
};

export const useDataHooksFactory = (objectType: AssigneesContainerEntityType): DataHooksInterface => {
  switch (objectType) {
    case EntityType.CHECKLIST_ITEM: {
      const { useDataProvider, useDataPersister } = require('./checklistItemDataHooks');

      return {
        useDataProvider,
        useDataPersister,
      };
    }

    case EntityType.TASK_DATA: {
      const { useDataProvider, useDataPersister } = require('./cardDataHooks');

      return {
        useDataProvider,
        useDataPersister,
      };
    }

    default: {
      throw new Error(`Not implemented objectType: ${objectType} used in AssigneesController`);
    }
  }
};
