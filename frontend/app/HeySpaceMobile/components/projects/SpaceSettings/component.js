import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import RadioButton from 'commonComponents/RadioButton';
import SpaceColorEditor from '../../projects/SpaceColorEditor';

SpaceSettings.propTypes = {
  spaceName: PropTypes.string.isRequired,
  isSpaceNameValid: PropTypes.bool.isRequired,
  spaceNameInputValidationMessage: PropTypes.string,
  isPrivate: PropTypes.bool.isRequired,
  isProjectEditable: PropTypes.bool.isRequired,
  spaceColor: PropTypes.string.isRequired,
  spacePurpose: PropTypes.string.isRequired,

  onChangeSpaceNameInput: PropTypes.func.isRequired,
  onSpaceNameInputBlur: PropTypes.func.isRequired,
  onSpacePurposeInputBlur: PropTypes.func.isRequired,
  onUpdateSpaceColor: PropTypes.func.isRequired,
  onChangeSpacePurposeInput: PropTypes.func.isRequired,
  onSetIsPrivate: PropTypes.func.isRequired,
};

function SpaceSettings(props) {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.section}>
        {/*TODO: icon*/}
        <Text style={styles.sectionTitle}>{'Details'}</Text>
        <Text style={styles.permissionWarn}>{'Note that only Project manager can fully modify project settings.'}</Text>
        <Text style={styles.label}>{'Project name'}</Text>
        <TextInput
          style={styles.input}
          value={props.spaceName}
          editable={props.isProjectEditable}
          onChangeText={props.onChangeSpaceNameInput}
          onBlur={props.onSpaceNameInputBlur}
        />

        <Text style={styles.label}>{'Purpose'}</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          value={props.spacePurpose}
          editable={props.isProjectEditable}
          onChangeText={props.onChangeSpacePurposeInput}
          onBlur={props.onSpacePurposeInputBlur}
        />

        <Text style={styles.label}>{'Color'}</Text>
        <SpaceColorEditor
          containerStyle={{ marginTop: 25 }}
          selectedColor={props.spaceColor}
          isDisabled={!props.isProjectEditable}
          onUpdateColor={props.onUpdateSpaceColor}
        />
      </View>

      <View style={styles.section}>
        {/*TODO: icon*/}
        <Text style={styles.sectionTitle}>{'Project privacy'}</Text>
        <TouchableWithoutFeedback onPress={() => props.onSetIsPrivate(false)}>
          <View style={styles.privacySetting}>
            <RadioButton
              isSelected={!props.isPrivate}
              onPress={() => props.onSetIsPrivate(false)}
              isDisabled={!props.isProjectEditable}
            />
            <Text style={styles.privacySettingText}>{'Public to team'}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.privacySettingDescription}>
          {'Project is visible to members of your team. Only people added to the project can edit it.'}
        </Text>

        <TouchableWithoutFeedback onPress={() => props.onSetIsPrivate(true)}>
          <View style={styles.privacySetting}>
            <RadioButton
              isSelected={props.isPrivate}
              onPress={() => props.onSetIsPrivate(true)}
              isDisabled={!props.isProjectEditable}
            />
            <Text style={styles.privacySettingText}>{'Private'}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.privacySettingDescription}>
          {'Project is private. Only people added to the project can view it and edit.'}
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SpaceSettings;
