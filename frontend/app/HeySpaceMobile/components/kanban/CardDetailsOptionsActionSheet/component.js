import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.js';

import ActionSheet from '../ActionSheet';
import { Text, View } from 'react-native';
import Trash from '../../Icons/Trash';
import Eye from '../../Icons/Eye';
import { blueGreyColor, brightBlueColor } from '../../../../common/commonStyles/colors';
import cardOptionsEnum from './cardOptionsEnum';

const cardOptions = Object.values(cardOptionsEnum);
const emptyArray = [];

CardDetailsOptionsActionSheet.propTypes = {
  isVisible: PropTypes.bool,
  isCurrentUserFollowingList: PropTypes.bool,
  isCurrentUserFollowingSpace: PropTypes.bool,
  isCurrentUserFollowingCard: PropTypes.bool,
  isCurrentUserAssignedToTask: PropTypes.bool,
  onClose: PropTypes.func,
  onSelectOption: PropTypes.func,
};

function CardDetailsOptionsActionSheet(props) {
  function onSelectOption(index) {
    return props.onSelectOption(cardOptions[index]);
  }

  const isDisabled =
    props.isCurrentUserFollowingSpace || props.isCurrentUserFollowingList || props.isCurrentUserAssignedToTask;

  return (
    <ActionSheet
      isVisible={props.isVisible}
      title={renderPopoverHeader()}
      options={cardOptions.map(renderPopoverMenuItem)}
      disabledIndexes={isDisabled ? [cardOptions.indexOf(cardOptionsEnum.FOLLOW_CARD)] : emptyArray}
      onClose={props.onClose}
      onSelectOption={onSelectOption}
    />
  );

  function renderPopoverMenuItem(item, index, array) {
    return (
      <View style={styles.popoverMenuItem}>
        {renderPopoverItemIcon(item)}
        <Text style={styles.popoverMenuItemLabel}>{getLabel(item)}</Text>
      </View>
    );
  }

  function getLabel(option) {
    if (option === cardOptionsEnum.FOLLOW_CARD) {
      if (props.isCurrentUserFollowingSpace) {
        return <Text style={styles.disabled}>{'Following project'}</Text>;
      } else if (props.isCurrentUserFollowingList) {
        return <Text style={styles.disabled}>{'Following list'}</Text>;
      }

      return props.isCurrentUserFollowingCard ? 'Unfollow task' : 'Follow task';
    }

    return option;
  }

  function renderPopoverItemIcon(item) {
    switch (item) {
      case cardOptionsEnum.ARCHIVE_CARD:
        return <Trash svgProps={{ style: styles.popoverIcon }} color={brightBlueColor} />;
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
}

export default CardDetailsOptionsActionSheet;
