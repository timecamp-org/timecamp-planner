import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { doNothing } from 'common/utils'
import styles from './styles'

import { View } from 'react-native'
import IOSMembers from 'components/settings/IOSMembers'
import TabNavigation from 'commonComponents/TabNavigation'
import { tabItemTypes } from './enhancers/EnhanceWorkspaceMembers'
import { lightGreyColor } from 'common/commonStyles/colors'


WorkspaceMembers.propTypes = {
  isActionSheetOpen: PropTypes.bool,
  selectedUserId: PropTypes.string,
  isUserDeactivationConfirmationModalOpen: PropTypes.bool,
  selectedTab: PropTypes.oneOf([tabItemTypes.ACTIVE_MEMBERS, tabItemTypes.DEACTIVATED_MEMBERS]).isRequired,
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  userNamesByIds: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,
  listOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  destructiveOptions: PropTypes.arrayOf(PropTypes.string),
  areItemsClickable: PropTypes.bool,
  onItemPress: PropTypes.func,
  onOptionSelect: PropTypes.func,
  onChangeSelectedTab: PropTypes.func,
  onCloseUserDeactivationConfirmationModal: PropTypes.func,
}

WorkspaceMembers.defaltProps = {
  destructiveOptions: [],
  areItemsClickable: false,
  onItemPress: doNothing,
  onOptionSelect: doNothing,
  onChangeSelectedTab: doNothing,
  onCloseUserDeactivationConfirmationModal: doNothing,
}

function WorkspaceMembers(props) {
  return (
    <View style={styles.component}>
      <TabNavigation
        tabItems={props.tabItems}
        selectedTab={props.selectedTab}
        wrapperBackgroundColorIOS={lightGreyColor}
        onChangeTab={props.onChangeSelectedTab}
      />

      <IOSMembers
        isActionSheetOpen={props.isActionSheetOpen}
        selectedUserId={props.selectedUserId}
        isUserDeactivationConfirmationModalOpen={props.isUserDeactivationConfirmationModalOpen}
        isTransferOwnershipModalOpen={props.isTransferOwnershipModalOpen}
        userIds={props.selectedTab === tabItemTypes.ACTIVE_MEMBERS ? props.userIds : props.deactivatedUserIds}
        userNamesByIds={props.userNamesByIds}
        areItemsClickable={props.areItemsClickable}
        listOptions={props.listOptions}
        destructiveOptions={props.destructiveOptions}

        onItemPress={props.onItemPress}
        onCloseActionSheet={props.onCloseActionSheet}
        onCloseUserDeactivationConfirmationModal={props.onCloseUserDeactivationConfirmationModal}
        onCloseTransferOwnershipModal={props.onCloseTransferOwnershipModal}
        onOptionSelect={props.onOptionSelect}
      />
    </View>
  )
}

export default WorkspaceMembers
