import React, { KeyboardEventHandler, LegacyRef, ReactNode } from 'react';

import { List } from 'immutable';

import { doNothing } from 'common/utils';
import { distanceInWords } from 'common/utils/dateOperations';
import { Id } from 'common/utils/identifier';
import {
  ConversationDescriptorRecordInterface,
  ProjectType,
  QuickSwitcherChatDescriptorInterface
} from 'models/domain/ProjectsModel/types';

import { dateNow } from '../../../../common/utils/date';

import ConversationRow from './ConversationRow';
import SpaceRow from './SpaceRow';
import styles from './styles.css';

const emptyList = List();

interface QuickSwitcherModalChatsContentInterface {
  highlightedObjectId: Id;
  searchValue: string;
  filteredChatDescriptors: List<QuickSwitcherChatDescriptorInterface>;
  onSetSearchValue: (value: string) => void;
  onJoinSpace: VoidFunction;
  onGoToProject: (projectId: Id) => void;
  onSetInputRef: LegacyRef<HTMLDivElement>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onMouseMoveOverListItem: (projectId: Id) => void;
  children: ReactNode;
}

const QuickSwitcherModalChatsContent: React.FC<QuickSwitcherModalChatsContentInterface> = ({
  filteredChatDescriptors = emptyList,
  highlightedObjectId,
  onSetSearchValue = doNothing,
  onJoinSpace = doNothing,
  onGoToProject = doNothing,
  onSetInputRef = doNothing,
  onKeyDown = doNothing,
  onMouseMoveOverListItem = doNothing,
}) => {
  function renderChatDescriptor(descriptor: ConversationDescriptorRecordInterface) {
    return descriptor.type === ProjectType.PROJECT ? (
      <SpaceRow
        key={`SpacesListSearch-${descriptor.projectId}`}
        descriptor={descriptor}
        onGoToProject={onGoToProject}
        onJoinSpace={onJoinSpace}
        onMouseMoveOverListItem={onMouseMoveOverListItem}
        isHighlighted={getIsHighlighted(descriptor.projectId, highlightedObjectId)}
      />
    ) : (
      <ConversationRow
        key={`SpacesListSearch-${descriptor.conversationId}`}
        descriptor={descriptor}
        onGoToProject={onGoToProject}
        onMouseMoveOverListItem={onMouseMoveOverListItem}
        isHighlighted={getIsHighlighted(descriptor.projectId, highlightedObjectId)}
      />
    );
  }

  return (
    <div className={styles.Component} tabIndex={-1}>
      <div className={styles.searchResults}>{filteredChatDescriptors.map(renderChatDescriptor)}</div>
    </div>
  );
};

export function renderLastActivityLabel(lastConversationMessageCreatedAt: number): React.ReactElement {
  return (
    <div className={styles.dateLabel}>
      {distanceInWords(dateNow(), new Date(lastConversationMessageCreatedAt), {
        addSuffix: true,
      })}
    </div>
  );
}

function getIsHighlighted(spaceId: Id, highlightedObjectId: Id): boolean {
  return spaceId === highlightedObjectId;
}

export default QuickSwitcherModalChatsContent;
