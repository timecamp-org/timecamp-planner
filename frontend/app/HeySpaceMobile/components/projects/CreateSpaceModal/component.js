import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { whiteTwoColor, cloudyBlueColor } from 'common/commonStyles/colors';

import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import UniversalModal from 'commonComponents/UniversalModal';
import X from 'Icons/X';
import Input from '../../credentials/Input';
import SpaceColorEditor from '../SpaceColorEditor';
import RadioButton from 'commonComponents/RadioButton';
import PrimaryButton from 'commonComponents/PrimaryButton';

CreateSpaceModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  onSetSpaceNameInputOuterRef: PropTypes.func.isRequired,
  onSetSpaceNameInputInnerRef: PropTypes.func.isRequired,

  selectedColor: PropTypes.string.isRequired,
  onChangeSelectedColor: PropTypes.func.isRequired,
  onSetIsPrivate: PropTypes.func.isRequired,
  onCreateSpace: PropTypes.func.isRequired,
  validateSpaceName: PropTypes.func.isRequired,
};

function CreateSpaceModal(props) {
  return (
    <UniversalModal
      style={styles.modal}
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      backdropOpacity={1}
      backdropColor={whiteTwoColor}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{'CREATE PROJECT'}</Text>
          <TouchableOpacity onPress={props.onClose}>
            <X color={cloudyBlueColor} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <Text style={styles.sectionTitle}>{'Project name'}</Text>
          <Input
            innerRef={props.onSetSpaceNameInputInnerRef}
            outerRef={props.onSetSpaceNameInputOuterRef}
            validator={props.validateSpaceName}
          />

          <Text style={styles.sectionTitle}>{'Project color'}</Text>
          <SpaceColorEditor
            containerStyle={{ marginTop: 25 }}
            selectedColor={props.selectedColor}
            onUpdateColor={props.onChangeSelectedColor}
          />

          <Text style={styles.sectionTitle}>{'Project privacy'}</Text>
          <TouchableWithoutFeedback onPress={() => props.onSetIsPrivate(false)}>
            <View style={styles.privacySetting}>
              <RadioButton isSelected={!props.isPrivate} onPress={() => props.onSetIsPrivate(false)} />
              <Text style={styles.privacySettingText}>{'Public to team'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.privacySettingDescription}>
            {'Project is visible to members of your team. Only people added to the project can edit it.'}
          </Text>

          <TouchableWithoutFeedback onPress={() => props.onSetIsPrivate(true)}>
            <View style={styles.privacySetting}>
              <RadioButton isSelected={props.isPrivate} onPress={() => props.onSetIsPrivate(true)} />
              <Text style={styles.privacySettingText}>{'Private'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.privacySettingDescription}>
            {'Project is private. Only people added to the project can view it and edit.'}
          </Text>

          <View style={styles.bottomButtons}>
            <PrimaryButton text={'Create project'} onPress={props.onCreateSpace} />
          </View>
        </ScrollView>
      </View>
    </UniversalModal>
  );
}

export default CreateSpaceModal;
