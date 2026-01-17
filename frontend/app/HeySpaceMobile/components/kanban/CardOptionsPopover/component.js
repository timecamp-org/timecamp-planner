import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import PopoverMenu from 'commonComponents/PopoverMenu';

import FollowCardSwitcher from '../../kanban/FollowObjectSwitcher/taskId';

import MoreVertical from 'Icons/MoreVertical';
import Trash from 'Icons/Trash';

import styles from './styles';
import { blueGreyColor, brightBlueColor } from 'common/commonStyles/colors';
import { doNothing } from 'common/utils';
import cardOptionsEnum from '../CardDetailsOptionsActionSheet/cardOptionsEnum';
import Eye from '../../Icons/Eye';

const cardOptions = Object.values(cardOptionsEnum);

CardOptionsPopover.propTypes = {
  taskId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  isCurrentUserFollowingList: PropTypes.bool,
  isCurrentUserFollowingSpace: PropTypes.bool,
  isCurrentUserFollowingCard: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onSelectOption: PropTypes.func,

  listOptions: PropTypes.array,
  isListOptionsOpen: PropTypes.bool,
  onCloseListOptions: PropTypes.func,
  onShowListOptions: PropTypes.func,
};

CardOptionsPopover.defaultProps = {
  listOptions: [],
  isListOptionsOpen: false,
  onCloseListOptions: doNothing,
  onSelectOption: doNothing,
  onShowListOptions: doNothing,
};

export default function CardOptionsPopover(props) {
  return (
    <Fragment>
      <PopoverMenu
        items={cardOptions.filter((option) => option !== cardOptionsEnum.FOLLOW_CARD)}
        isVisible={props.isOpened}
        from={renderMoreButton()}
        placement={'bottom'}
        onRequestClose={props.onClose}
        onItemClick={props.onSelectOption}
        itemRenderer={renderPopoverMenuItem}
        headerRenderer={renderPopoverHeader}
        footerRenderer={renderPopoverFooter}
      />
    </Fragment>
  );

  function renderMoreButton() {
    return (
      <TouchableOpacity style={styles.moreButton} onPress={props.onOpen}>
        <MoreVertical svgProps={{ style: styles.moreVerticalIcon }} currentColor={blueGreyColor} />
      </TouchableOpacity>
    );
  }

  function renderPopoverMenuItem(item) {
    return (
      <View style={styles.popoverMenuItem}>
        {renderPopoverItemIcon(item)}
        <Text style={styles.popoverMenuItemLabel}>{item}</Text>
      </View>
    );
  }

  function renderPopoverItemIcon(item) {
    switch (item) {
      case cardOptionsEnum.ARCHIVE_CARD:
        return <Trash svgProps={{ style: styles.popoverIcon }} color={blueGreyColor} />;
      case cardOptionsEnum.FOLLOW_CARD:
        return (
          <Eye
            svgProps={{ style: styles.popoverIcon }}
            currentColor={
              props.isCurrentUserFollowingSpace || props.isCurrentUserFollowingList ? blueGreyColor : brightBlueColor
            }
          />
        );
      default:
        return null;
    }
  }

  function renderPopoverHeader() {
    return <Text style={styles.popoverHeader}>{'Task options'}</Text>;
  }

  function renderPopoverFooter() {
    if (cardOptions.indexOf(cardOptionsEnum.FOLLOW_CARD) === -1) {
      return null;
    }

    return <FollowCardSwitcher taskId={props.taskId} />;
  }
}
