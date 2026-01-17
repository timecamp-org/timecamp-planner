import React, { useCallback } from 'react';
import styles from './styles';
import { cloudyBlueColor, whiteTwoColor } from 'common/commonStyles/colors';

import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import UniversalModal from 'commonComponents/UniversalModal';
import X from 'Icons/X';
import SpaceRow from '../SpaceRow';
import { useComponent } from './hook';
import { doNothing } from 'common/utils';
import { ProjectInterface } from '../../../../common/models/domain/ProjectsModel/types';

export type BrowseSpacesModalInterface = {
  isVisible?: boolean;
  onClose?: VoidFunction;
};

const defaultProps = {
  isVisible: false,
  onClose: doNothing,
};

const BrowseSpacesModal: React.FC<BrowseSpacesModalInterface> = (props) => {
  const hook = useComponent(props);

  const renderJoinableSpaceRow = useCallback(
    (space: ProjectInterface) => {
      return <SpaceRow key={space.id} spaceId={space.id} isJoinable onClose={props.onClose} />;
    },
    [props.onClose]
  );

  const renderSpaceRow = useCallback(
    (space: ProjectInterface) => {
      return <SpaceRow key={space.id} spaceId={space.id} onClose={props.onClose} />;
    },
    [props.onClose]
  );

  return (
    <UniversalModal
      style={styles.modal}
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      backdropOpacity={1}
      backdropColor={whiteTwoColor}
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.top}>
          <Text style={styles.title}>{'Browse projects'}</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={props.onClose}>
            <X color={cloudyBlueColor} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {hook.availableInvisibleSpaces.size > 0 && <Text style={styles.sectionTitle}>{'Projects you can join'}</Text>}
          {hook.availableInvisibleSpaces.map(renderJoinableSpaceRow)}
          {hook.availableVisibleSpaces.size > 0 && <Text style={styles.sectionTitle}>{'Projects you belong to'}</Text>}
          {hook.availableVisibleSpaces.map(renderSpaceRow)}
        </ScrollView>
      </SafeAreaView>
    </UniversalModal>
  );
};

BrowseSpacesModal.defaultProps = defaultProps;

export default BrowseSpacesModal;
