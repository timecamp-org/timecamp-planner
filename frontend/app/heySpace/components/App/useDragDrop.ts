import { useCallback } from 'react';

import {
  DragStart,
  ResponderProvided,
  DropResult,
  DraggableLocation,
} from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { onMoveChecklistItem } from 'models/domain/ChecklistsModel/actions';
import { onMoveList } from 'models/domain/ListsModel/actions';
import {
  onMoveProjectInStructure,
  onMoveProjectGroup,
} from 'models/domain/PersonalProjectStructureModel/actions';
import { ProjectDroppableType } from 'models/domain/PersonalProjectStructureModel/types';
import * as TasksActions from 'models/domain/TasksModel/actions';

type UseDragDropInterface = {
  onDragStart: (initial: DragStart, provided: ResponderProvided) => void;
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
};

export enum DraggableType {
  TASK = 'TASK',
  SECTION = 'SECTION',
  CHECKLIST = 'CHECKLIST',
  SPACE = 'SPACE',
  SPACE_GROUP = 'SPACE_GROUP',
}

function getProjectDroppableType(groupId: string): ProjectDroppableType {
  if (groupId === ProjectDroppableType.LOOSE) {
    return ProjectDroppableType.LOOSE;
  } else {
    return ProjectDroppableType.GROUP;
  }
}

export const useDragDrop = (): UseDragDropInterface => {
  const dispatch = useDispatch();

  const onDragStart = useCallback(
    (initial: DragStart, provided: ResponderProvided) => {
      // maybe not usable for now
    },
    []
  );

  const onDragEnd = useCallback((result: DropResult) => {
    const { draggableId, type, source, destination, reason } = result;
    if (reason === 'DROP' && source && destination) {
      switch (type) {
        case DraggableType.TASK:
          return handleMoveTaskInSections(draggableId, source, destination);
        case DraggableType.SECTION:
          return handleMoveSection(draggableId, source, destination);
        case DraggableType.CHECKLIST:
          return handleMoveChecklistItem(draggableId, source, destination);
        case DraggableType.SPACE:
          return handleMoveProjectInStructure(draggableId, source, destination);
        case DraggableType.SPACE_GROUP:
          return handleMoveProjectGroup(draggableId, source, destination);
        default:
          return null;
      }
    } else {
      // ok, cancelled
      return null;
    }
  }, []);

  const handleMoveTaskInSections = (
    draggedTaskId: Id,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const sourceSectionId = source.droppableId;
    const destinationSectionId = destination.droppableId;
    if (
      source.index === destination.index &&
      sourceSectionId === destinationSectionId
    ) {
      // nothing changed
    } else {
      dispatch(
        TasksActions.onMoveTaskInSections(
          draggedTaskId,
          source.index,
          destination.index,
          sourceSectionId,
          destinationSectionId
        )
      );
    }
  };

  const handleMoveSection = (
    draggedSectionId: Id,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    if (source.index === destination.index) {
      // nothing changed
    } else {
      dispatch(onMoveList(draggedSectionId, destination.index));
    }
  };

  const handleMoveChecklistItem = (
    draggedChecklistItemId: Id,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    if (source.index === destination.index) {
      // nothing changed
    } else {
      dispatch(
        onMoveChecklistItem(
          draggedChecklistItemId,
          destination.index,
          destination.droppableId
        )
      );
    }
  };

  const handleMoveProjectInStructure = (
    draggedSpaceId: Id,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const sourceGroupId = source.droppableId;
    const destinationGroupId = destination.droppableId;
    if (
      source.index === destination.index &&
      sourceGroupId === destinationGroupId
    ) {
      // nothing changed
    } else {
      dispatch(
        onMoveProjectInStructure(
          draggedSpaceId,
          destination.index,
          getProjectDroppableType(sourceGroupId),
          sourceGroupId,
          getProjectDroppableType(destinationGroupId),
          destinationGroupId
        )
      );
    }
  };

  const handleMoveProjectGroup = (
    draggedGroupId: Id,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    if (source.index === destination.index) {
      // nothing changed
    } else {
      dispatch(onMoveProjectGroup(draggedGroupId, destination.index));
    }
  };

  return {
    onDragStart,
    onDragEnd,
  };
};
