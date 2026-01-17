import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles.css';

import { doNothing } from 'common/utils';
import colorStyles from 'styles/colors.css';
import UniversalPopover from 'commonComponents/UniversalPopover';
import ConvertToCardCommentPopoverContent from 'commonComponents/ConvertToCardCommentPopoverContent';

ConvertMessageToCard.propTypes = {
  renderTargetComponent: PropTypes.func.isRequired,
  isPopoverOpened: PropTypes.bool,
  isAddCardDisabled: PropTypes.bool,
  color: PropTypes.string,
  spaceIds: ImmutablePropTypes.list.isRequired,
  listIds: ImmutablePropTypes.list.isRequired,
  cardIds: ImmutablePropTypes.list.isRequired,
  selectedSpaceId: PropTypes.string,
  selectedListId: PropTypes.string,
  selectedCardId: PropTypes.string,

  onTargetButtonClick: PropTypes.func,
  onSelectSpaceId: PropTypes.func,
  onSelectListId: PropTypes.func,
  onSelectCardId: PropTypes.func,
  onOpenPopover: PropTypes.func,
  onClickClosePopover: PropTypes.func,
  onConvertMessageToCardComment: PropTypes.func,
};

ConvertMessageToCard.defaultProps = {
  isPopoverOpened: false,
  isAddCardDisabled: false,
  color: colorStyles.wisteriaColor,

  onTargetButtonClick: doNothing,
  onSelectSpaceId: doNothing,
  onSelectListId: doNothing,
  onOpenPopover: doNothing,
  onClickClosePopover: doNothing,
  onConvertMessageToCardComment: doNothing,
  onChangeCardName: doNothing,
};

function ConvertMessageToCard(props) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={props.renderTargetComponent(props.onTargetButtonClick)}
      popperComponent={
        <ConvertToCardCommentPopoverContent
          isAddCardDisabled={props.isAddCardDisabled}
          color={props.color}
          spaceIds={props.spaceIds}
          listIds={props.listIds}
          cardIds={props.cardIds}
          selectedSpaceId={props.selectedSpaceId}
          selectedListId={props.selectedListId}
          selectedCardId={props.selectedCardId}
          onSelectSpaceId={props.onSelectSpaceId}
          onSelectListId={props.onSelectListId}
          onSelectCardId={props.onSelectCardId}
          onClickClosePopover={props.onClickClosePopover}
          onConvertToCardComment={props.onConvertMessageToCardComment}
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
