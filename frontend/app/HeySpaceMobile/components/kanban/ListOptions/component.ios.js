import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ActionSheet from '../ActionSheet';

import MoreVertical from 'Icons/MoreVertical';
import Add from 'Icons/Add';
import ArrowRight from 'Icons/ArrowRight';
import Copy from 'Icons/Copy';
import Trash from 'Icons/Trash';
import Eye from 'Icons/Eye';

import styles from './styles';
import { blueGreyColor } from 'common/commonStyles/colors';
import { doNothing } from 'common/utils';
import listOptionsEnum from '../../kanban/List/listOptionsEnum';

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
  color: '#007aff',
};

export default function ListOptions(props) {
  return (
    <Fragment>
      {renderMoreButton()}
      <ActionSheet
        isVisible={props.isListOptionsOpen}
        title={renderPopoverHeader()}
        options={props.listOptions.map(renderPopoverMenuItem)}
        onSelectOption={props.onSelectOption}
        onClose={props.onCloseListOptions}
        onSelectOption={onSelectOption}
        disabledIndexes={
          props.isCurrentUserFollowingSpace ? [props.listOptions.indexOf(listOptionsEnum.FOLLOW_LIST)] : []
        }
      />
    </Fragment>
  );

  function onSelectOption(index) {
    return props.onSelectOption(props.listOptions[index]);
  }

  function renderMoreButton() {
    return (
      <TouchableOpacity style={styles.moreButton} onPress={props.onShowListOptions}>
        <MoreVertical svgProps={{ style: styles.moreVerticalIcon }} currentColor={blueGreyColor} />
      </TouchableOpacity>
    );
  }

  function renderPopoverMenuItem(item, index, array) {
    return (
      <View style={styles.popoverMenuItem}>
        {renderPopoverItemIcon(item)}
        <Text style={styles.popoverMenuItemLabel}>{getLabel(item)}</Text>
      </View>
    );
  }

  function getLabel(option) {
    if (option === listOptionsEnum.FOLLOW_LIST) {
      if (props.isCurrentUserFollowingSpace) {
        return <Text style={styles.disabled}>{'Following project'}</Text>;
      }

      return props.isCurrentUserFollowingListOrSpace ? 'Unfollow list' : 'Follow list';
    }

    return option;
  }

  function renderPopoverItemIcon(item) {
    switch (item) {
      case listOptionsEnum.ADD_CARD:
        return <Add svgProps={{ style: styles.popoverIcon }} currentColor={props.color} />;
      case listOptionsEnum.MOVE_LIST:
        return <ArrowRight svgProps={{ style: styles.popoverIcon }} currentColor={props.color} />;
      case listOptionsEnum.COPY_LIST:
        return <Copy style={styles.popoverIcon} color={props.color} />;
      case listOptionsEnum.MOVE_ALL_CARDS:
        return <ArrowRight svgProps={{ style: styles.popoverIcon }} currentColor={props.color} />;
      case listOptionsEnum.ARCHIVE_LIST:
        return <Trash svgProps={{ style: styles.popoverIcon }} color={props.color} />;
      case listOptionsEnum.FOLLOW_LIST:
        return (
          <Eye
            svgProps={{ style: styles.popoverIcon }}
            currentColor={props.isCurrentUserFollowingSpace ? blueGreyColor : props.color}
          />
        );
      default:
        return null;
    }
  }

  function renderPopoverHeader() {
    return <Text style={styles.popoverHeader}>{'List options'}</Text>;
  }
}
