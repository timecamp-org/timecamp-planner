import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import X from 'Icons/X';
import styles from './styles';
import { wisteriaColor, whiteTwoColor } from 'common/commonStyles/colors';

import PersonIcon from '../../person/PersonIcon';
import PersonFullName from '../../person/PersonFullName';
import PlusIcon from 'Icons/Plus';
import DeleteConfirmationModal from 'commonComponents/DeleteConfirmationModal';
import { doNothing } from 'common/utils';

ProjectMembers.propTypes = {
  projectPeople: ImmutablePropTypes.list.isRequired,
  projectColor: PropTypes.string,
  isCurrentUserOrganizationGuest: PropTypes.bool,
  isProjectEditable: PropTypes.bool,
  isRemoveModalOpen: PropTypes.bool.isRequired,
  onRemoveMember: PropTypes.func.isRequired,
  onRemoveModalClose: PropTypes.func.isRequired,
  shouldRenderRemoveUser: PropTypes.func,
};

ProjectMembers.defaultProps = {
  projectColor: wisteriaColor,
  isProjectEditable: true,
  isCurrentUserOrganizationGuest: false,
  shouldRenderRemoveUser: doNothing,
};

export default function ProjectMembers(props) {
  return (
    <View style={styles.component}>
      <ScrollView>
        <View style={styles.list}>
          {props.projectPeople.map(renderUserRow)}
          {renderModal()}
        </View>
      </ScrollView>
      {!props.isCurrentUserOrganizationGuest && renderFloatingActionButton()}
    </View>
  );

  function renderUserRow(userId) {
    return (
      <View key={`ProjectMembers_user_${userId}`} style={styles.row}>
        <View style={styles.personDetails}>
          <PersonIcon style={styles.personIcon} userId={userId} />
          <PersonFullName numberOfLines={1} style={styles.personFullName} userId={userId} />
        </View>
        {props.shouldRenderRemoveUser(userId) && (
          <TouchableOpacity style={styles.removeButton} onPress={() => props.onRemoveModalOpen(userId)}>
            <X style={styles.removeIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderModal() {
    return (
      <DeleteConfirmationModal
        isVisible={props.isRemoveModalOpen}
        title={'Remove user from project'}
        description={'Are you sure you want to remove this user from project?'}
        deleteButtonText={'REMOVE'}
        onClose={props.onRemoveModalClose}
        onDelete={props.onRemoveMember}
      />
    );
  }

  function renderFloatingActionButton() {
    const backgroundColor = props.projectColor;
    return (
      <TouchableOpacity
        style={{ ...styles.floatingActionButton, backgroundColor }}
        onPress={props.onNavigateToAddMembers}
      >
        <PlusIcon color={whiteTwoColor} style={styles.plusIcon} />
      </TouchableOpacity>
    );
  }
}
