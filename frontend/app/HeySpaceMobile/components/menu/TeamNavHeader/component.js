import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { darkTwoColor } from 'common/commonStyles/colors'
import { CREATE_CONVERSATION_MODAL, INVITE_USER_MODAL } from './enhancers/EnhanceTeamNavHeader'

import { View, Text, TouchableOpacity } from 'react-native'
import Plus from 'Icons/Plus'
import Search from 'Icons/Search'
import CreateConversationModal from '../../common/CreateConversationModal'
import InviteUserModal from '../../common/InviteUserModal'

TeamNavHeader.propTypes = {
  openedModalType: PropTypes.oneOf([CREATE_CONVERSATION_MODAL, INVITE_USER_MODAL, null]),
  canCurrentUserInvitePeople: PropTypes.bool,
  onSetIsModalOpened: PropTypes.func.isRequired,
  onOpenCreateConversationModal: PropTypes.func.isRequired,
  onCloseCreateConversationModal: PropTypes.func.isRequired,
  onOpenInviteUserModal: PropTypes.func.isRequired,
  onCloseInviteUserModal: PropTypes.func.isRequired,
}

function TeamNavHeader(props) {
  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.teamButton}
        onPress={props.onOpenCreateConversationModal}
      >
        <Search />
        <Text style={styles.teamTitle}>{'TEAM'}</Text>
      </TouchableOpacity>

      {props.canCurrentUserInvitePeople && <TouchableOpacity
        style={styles.plusIconWrapper}
        onPress={props.onOpenInviteUserModal}
      >
        <Plus color={darkTwoColor} />
      </TouchableOpacity>
      }

      <CreateConversationModal
        isVisible={!!(props.openedModalType && props.openedModalType === CREATE_CONVERSATION_MODAL)}
        onClose={props.onCloseCreateConversationModal}
      />

      <InviteUserModal
        isVisible={!!(props.openedModalType && props.openedModalType === INVITE_USER_MODAL)}
        onClose={props.onCloseInviteUserModal}
      />

    </View>
  )
}

export default TeamNavHeader
