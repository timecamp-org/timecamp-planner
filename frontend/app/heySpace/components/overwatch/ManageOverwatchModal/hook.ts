import { ManageOverwatchModalInterface } from './index';
import { List } from 'immutable';
import { Id } from 'common/utils/identifier';
import { useDataProvider, useDataPersister } from './dataHooks';
import { ChangeEvent, useCallback, useState, useEffect } from 'react';
import fuzzysearch from 'fuzzysearch';
import useCompare from 'common/hooks/useCompare';

const emptyList = List();

export type ManageOverwatchModalHookInterface = {
  isModalOpen: boolean;
  searchPhrase: string;
  filteredSpaceIds: List<Id>;
  selectedSpaceIds: List<Id>;
  onChangeSearchPhrase: (event: ChangeEvent<HTMLInputElement>) => void;
  onSpaceItemClick: (spaceId: Id) => void;
  onSelectAllProjects: () => void;
  onDeselectAllProjects: () => void;
  onModalSave: VoidFunction;
  onCloseModal: VoidFunction;
  onCancel: VoidFunction;
};

const useComponent = (props: ManageOverwatchModalInterface): ManageOverwatchModalHookInterface => {
  const dataProvider = useDataProvider();
  const dataPersister = useDataPersister();

  const { isModalOpen, spaceNames, availableSpaceIds, overwatchViewId } = dataProvider;

  const [searchPhrase, onSetSearchPhrase] = useState('');
  const [filteredSpaceIds, onSetFilteredSpaceIds] = useState(availableSpaceIds);
  const [selectedSpaceIds, onSetSelectedSpaceIds] = useState(dataProvider.selectedSpaceIds);

  useEffect(() => {
    if (isModalOpen) {
      onSetSearchPhrase('');
      onSetSelectedSpaceIds(dataProvider.selectedSpaceIds);
      onSetFilteredSpaceIds(availableSpaceIds);
    }
  }, [isModalOpen, dataProvider.selectedSpaceIds, availableSpaceIds]);

  const isAvailableSpaceIdsChanged = useCompare<List<Id>>(availableSpaceIds);

  const onFilterSpaceIds = useCallback(
    (phrase: string) => {
      let filteredIds = availableSpaceIds;

      if (phrase.length > 0) {
        filteredIds = availableSpaceIds.filter((spaceId) => {
          const spaceName = spaceNames.get(spaceId).toLowerCase();
          return fuzzysearch(phrase.toLowerCase(), spaceName);
        }) as List<Id>;
      }
      onSetFilteredSpaceIds(filteredIds);
    },
    [onSetFilteredSpaceIds, spaceNames, availableSpaceIds]
  );

  const onChangeSearchPhrase = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const phrase = event.target.value;
      onSetSearchPhrase(phrase);
      onFilterSpaceIds(phrase);
    },
    [onSetSearchPhrase, onFilterSpaceIds]
  );

  const onSpaceItemClick = useCallback(
    (spaceId: Id) => {
      if (selectedSpaceIds.includes(spaceId)) {
        onSetSelectedSpaceIds(selectedSpaceIds.filterNot((selectedSpaceId) => spaceId === selectedSpaceId) as List<Id>);
      } else {
        onSetSelectedSpaceIds(selectedSpaceIds.push(spaceId));
      }
    },
    [selectedSpaceIds, onSetSelectedSpaceIds]
  );

  useEffect(() => {
    if (isAvailableSpaceIdsChanged) {
      onFilterSpaceIds(searchPhrase);
    }
  }, [availableSpaceIds, isAvailableSpaceIdsChanged, onFilterSpaceIds, searchPhrase]);

  const onModalSave = useCallback(() => {
    if (overwatchViewId) {
      dataPersister.onUpdateOverwatch(selectedSpaceIds, overwatchViewId);
    } else {
      dataPersister.onCreateOverwatch(selectedSpaceIds);
    }
    dataPersister.onCloseModal();
  }, [
    selectedSpaceIds,
    dataPersister.onCreateOverwatch,
    dataPersister.onUpdateOverwatch,
    dataPersister.onCloseModal,
    overwatchViewId,
  ]);

  const onCancel = useCallback(() => {
    if (!overwatchViewId) {
      dataPersister.onCreateOverwatch(emptyList as List<Id>);
    }
    dataPersister.onCloseModal();
  }, [overwatchViewId, dataPersister.onCloseModal, dataPersister.onCreateOverwatch]);

  const onSelectAllProjects = () => onSetSelectedSpaceIds(availableSpaceIds);
  const onDeselectAllProjects = () => onSetSelectedSpaceIds(List());

  return {
    isModalOpen,
    searchPhrase,
    filteredSpaceIds,
    selectedSpaceIds,
    onChangeSearchPhrase,
    onSpaceItemClick,
    onCloseModal: dataPersister.onCloseModal,
    onCancel,
    onModalSave,
    onSelectAllProjects,
    onDeselectAllProjects,
  };
};

export default useComponent;
