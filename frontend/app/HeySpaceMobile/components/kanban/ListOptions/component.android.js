import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import PopoverMenu from 'commonComponents/PopoverMenu';

import FollowListSwitcher from '../../kanban/FollowObjectSwitcher/listId';

import Add from 'Icons/Add';
import ArrowRight from 'Icons/ArrowRight';
import Copy from 'Icons/Copy';
import MoreVertical from 'Icons/MoreVertical';
import Trash from 'Icons/Trash';

import { blueGreyColor } from 'common/commonStyles/colors';
import { doNothing } from 'common/utils';
import listOptionsEnum from '../../kanban/List/listOptionsEnum';
import styles from './styles';

ListOptions.propTypes = {
  listId: PropTypes.string.isRequired,
  listOptions: PropTypes.array,
  isListOptionsOpen: PropTypes.bool,
  onCloseListOptions: PropTypes.func,
  onSelectOption: PropTypes.func,
  onShowListOptions: PropTypes.func,
};

ListOptions.defaultProps = {
  listOptions: [],
  isListOptionsOpen: false,
  onCloseListOptions: doNothing,
  onSelectOption: doNothing,
  onShowListOptions: doNothing,
};

export default function ListOptions(props) {
  return (
    <Fragment>
      <PopoverMenu
        items={props.listOptions.filter((option) => option !== listOptionsEnum.FOLLOW_LIST)}
        isVisible={props.isListOptionsOpen}
        placement={'bottom'}
        from={renderMoreButton()}
        onRequestClose={props.onCloseListOptions}
        onItemClick={props.onSelectOption}
        itemRenderer={renderPopoverMenuItem}
        headerRenderer={renderPopoverHeader}
        footerRenderer={renderPopoverFooter}
      />
    </Fragment>
  );

  function renderMoreButton() {
    return (
      <TouchableOpacity style={styles.moreButton} onPress={props.onShowListOptions}>
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
      case listOptionsEnum.ADD_CARD:
        return <Add svgProps={{ style: styles.popoverIcon }} currentColor={blueGreyColor} />;
      case listOptionsEnum.MOVE_LIST:
        return <ArrowRight svgProps={{ style: styles.popoverIcon }} currentColor={blueGreyColor} />;
      case listOptionsEnum.COPY_LIST:
        return <Copy style={styles.popoverIcon} color={blueGreyColor} />;
      case listOptionsEnum.MOVE_ALL_CARDS:
        return <ArrowRight svgProps={{ style: styles.popoverIcon }} currentColor={blueGreyColor} />;
      case listOptionsEnum.ARCHIVE_LIST:
        return <Trash svgProps={{ style: styles.popoverIcon }} color={blueGreyColor} />;
      default:
        return null;
    }
  }

  function renderPopoverHeader() {
    return <Text style={styles.popoverHeader}>{'More Options'}</Text>;
  }

  function renderPopoverFooter() {
    if (props.listOptions.indexOf(listOptionsEnum.FOLLOW_LIST) === -1) {
      return null;
    }

    return <FollowListSwitcher listId={props.listId} />;
  }
}
