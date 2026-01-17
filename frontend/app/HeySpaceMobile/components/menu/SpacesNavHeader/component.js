import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { darkTwoColor } from 'common/commonStyles/colors';

import { CREATE_SPACE_MODAL, BROWSE_SPACES_MODAL } from './enhancer/EnhanceSpacesNavHeader';
import { View, Text, TouchableOpacity } from 'react-native';
import Plus from 'Icons/Plus';
import Search from 'Icons/Search';
import CreateSpaceModal from '../../projects/CreateSpaceModal';
import BrowseSpacesModal from '../../projects/BrowseSpacesModal';

SpacesNavHeader.propTypes = {
  openedModalType: PropTypes.oneOf([CREATE_SPACE_MODAL, BROWSE_SPACES_MODAL, null]),
  canCurrentUserCreateProject: PropTypes.bool,
  onOpenBrowseSpacesModal: PropTypes.func.isRequired,
  onCloseBrowseSpacesModal: PropTypes.func.isRequired,
  onOpenCreateSpaceModal: PropTypes.func.isRequired,
  onCloseCreateSpaceModal: PropTypes.func.isRequired,
};

function SpacesNavHeader(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.spacesButton} onPress={props.onOpenBrowseSpacesModal}>
        <Search />
        <Text style={styles.spacesTitle}>{'PROJECTS'}</Text>
      </TouchableOpacity>

      {props.canCurrentUserCreateProject && (
        <TouchableOpacity style={styles.plusIconWrapper} onPress={props.onOpenCreateSpaceModal}>
          <Plus color={darkTwoColor} />
        </TouchableOpacity>
      )}

      <CreateSpaceModal
        isVisible={!!(props.openedModalType && props.openedModalType === CREATE_SPACE_MODAL)}
        onClose={props.onCloseCreateSpaceModal}
      />

      <BrowseSpacesModal
        isVisible={!!(props.openedModalType && props.openedModalType === BROWSE_SPACES_MODAL)}
        onClose={props.onCloseBrowseSpacesModal}
      />
    </View>
  );
}

export default SpacesNavHeader;
