import React from 'react';

import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from '../../../../common/utils';

import SearchRow from './SearchRow';
import styles from './styles.css';

const emptyList = new List();

QuickSwitcherModalCardsContent.propTypes = {
  highlightedObjectId: PropTypes.string,
  searchValue: PropTypes.string.isRequired,
  filteredDescriptors: ImmutablePropTypes.list.isRequired,
  onSetSearchValue: PropTypes.func,
  onNavigateToCard: PropTypes.func,
  onNavigateToSpace: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseMoveOverListItem: PropTypes.func,
};

QuickSwitcherModalCardsContent.defaultProps = {
  searchValue: '',
  filteredDescriptors: emptyList,
  onSetSearchValue: doNothing,
  onNavigateToCard: doNothing,
  onNavigateToSpace: doNothing,
  onSetInputRef: doNothing,
  onKeyDown: doNothing,
  onMouseMoveOverListItem: doNothing,
};

function QuickSwitcherModalCardsContent(props) {
  return (
    <div
      ref={props.onSetContainerRef}
      className={styles.Component}
      tabIndex={-1}
      onKeyDown={props.onKeyDown}
    >
      <div className={styles.searchResults}>
        {props.filteredDescriptors.map((descriptor) => (
          <SearchRow
            key={descriptor.get('taskId')}
            descriptor={descriptor}
            isHighlighted={
              props.highlightedObjectId === descriptor.get('taskId')
            }
            onNavigateToSpace={props.onNavigateToSpace}
            onNavigateToCard={props.onNavigateToCard}
            onMouseMoveOverListItem={props.onMouseMoveOverListItem}
          />
        ))}
      </div>
    </div>
  );
}

export default QuickSwitcherModalCardsContent;
