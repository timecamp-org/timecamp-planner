import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import UniversalPopover from 'commonComponents/UniversalPopover';
import ConvertToCardPopoverContent from 'commonComponents/ConvertToCardPopoverContent';

ConvertMessageToCard.propTypes = {
  renderTargetComponent: PropTypes.func.isRequired,
  isPopoverOpened: PropTypes.bool,
  isAddCardDisabled: PropTypes.bool,
  color: PropTypes.string,
  spaceIds: ImmutablePropTypes.list.isRequired,
  listIds: ImmutablePropTypes.list.isRequired,
  selectedSpaceId: PropTypes.string,
  selectedListId: PropTypes.string,
  cardName: PropTypes.string,

  onTargetButtonClick: PropTypes.func,
  onSelectSpaceId: PropTypes.func,
  onSelectListId: PropTypes.func,
  onOpenPopover: PropTypes.func,
  onClickClosePopover: PropTypes.func,
  onConvertMessageToTask: PropTypes.func,
  onChangeCardName: PropTypes.func,
};

ConvertMessageToCard.defaultProps = {
  isPopoverOpened: false,

  onTargetButtonClick: doNothing,
  onOpenPopover: doNothing,
};

function ConvertMessageToCard(props) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={props.renderTargetComponent(props.onTargetButtonClick)}
      popperComponent={
        <ConvertToCardPopoverContent
          isAddCardDisabled={props.isAddCardDisabled}
          color={props.color}
          spaceIds={props.spaceIds}
          listIds={props.listIds}
          selectedSpaceId={props.selectedSpaceId}
          selectedListId={props.selectedListId}
          cardName={props.cardName}
          onSelectSpaceId={props.onSelectSpaceId}
          onSelectListId={props.onSelectListId}
          onClickClosePopover={props.onClickClosePopover}
          onConvertToCard={props.onConvertMessageToTask}
          onChangeCardName={props.onChangeCardName}
        />
      }
      popperPlacement={'top'}
      popperContentWrapperClassName={styles.popperContentWrapperClassName}
      popperModifiers={{
        offset: {
          offset: `0, 20`,
        },
      }}
    />
  );
}

export default memo(ConvertMessageToCard);
