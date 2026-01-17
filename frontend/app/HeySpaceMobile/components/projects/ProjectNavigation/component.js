import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Text, TouchableOpacity, View } from 'react-native';
import tabTypes from '../ProjectView/constants';
import { blueGreyColor } from 'common/commonStyles/colors';

import MoreVertical from 'Icons/MoreVertical';
import PopoverMenu from 'commonComponents/PopoverMenu';
import IconMembers from 'Icons/IconMembers';
import Settings from 'Icons/Settings';
import { List, fromJS } from 'immutable';
import RouteName from '../../AppNavigation/routeNames';
import TabNavigation from 'commonComponents/TabNavigation';

const menuItems = new List([
  {
    text: 'Settings',
    icon: Settings,
    key: 'settings',
    routeName: RouteName.PROJECT_SETTINGS,
  },
  {
    text: 'Members',
    icon: IconMembers,
    key: 'members',
    routeName: RouteName.PROJECT_MEMBERS,
  },
]);

const getTabItems = (isDirectChat, isCurrentUserOwnConversation) =>
  fromJS([
    {
      text: 'Chat',
      key: tabTypes.CHAT,
    },
    {
      text: isDirectChat ? (isCurrentUserOwnConversation ? 'My tasks' : 'Assigned tasks') : 'Board',
      key: tabTypes.BOARD,
    },
  ]);

ProjectNavigation.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  isPopoverVisible: PropTypes.bool,
  tabWidth: PropTypes.number,
  left: PropTypes.object,
  projectColor: PropTypes.string,
  projectIsGroupOrDirectChat: PropTypes.bool.isRequired,
  projectIsDirectChat: PropTypes.bool.isRequired,
  isCurrentUserOwnConversation: PropTypes.bool.isRequired,

  onChangeTab: PropTypes.func.isRequired,
  onSetIsPopoverVisible: PropTypes.func.isRequired,
  onMoreMenuItemClick: PropTypes.func.isRequired,
};

function ProjectNavigation(props) {
  const tabItems = getTabItems(props.projectIsDirectChat, props.isCurrentUserOwnConversation);
  return (
    <View style={styles.container}>
      <TabNavigation
        tabItems={tabItems}
        selectedTab={props.selectedTab}
        activeColor={props.projectColor}
        onChangeTab={props.onChangeTab}
        moreButtonRenderer={props.projectIsGroupOrDirectChat ? null : moreButtonRenderer(props)}
        additionalOffset={20}
      />
    </View>
  );
}

const moreButtonRenderer = (props) => () => {
  return (
    <Fragment>
      <PopoverMenu
        items={menuItems}
        isVisible={props.isPopoverVisible}
        placement={'bottom'}
        from={
          <TouchableOpacity style={styles.moreButton} onPress={() => props.onSetIsPopoverVisible(true)}>
            <MoreVertical svgProps={{ style: styles.moreVerticalIcon }} currentColor={blueGreyColor} />
          </TouchableOpacity>
        }
        onRequestClose={() => props.onSetIsPopoverVisible(false)}
        onItemClick={props.onMoreMenuItemClick}
        itemRenderer={renderPopoverMenuItem}
      />
    </Fragment>
  );
};

function renderPopoverMenuItem(item) {
  const { text, icon, routeName } = item;
  const IconComponent = icon;
  return (
    <View style={styles.menuItem}>
      <IconComponent style={styles.icon} color={blueGreyColor} />
      <Text style={styles.popoverMenuItemText}>{text}</Text>
    </View>
  );
}

export default ProjectNavigation;
