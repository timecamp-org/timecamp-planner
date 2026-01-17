import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-community/picker';
import UniversalModal from 'commonComponents/UniversalModal';

import styles from './styles';
import { doNothing } from 'common/utils';
import { wisteriaColor } from 'common/commonStyles/colors';

MoveListModal.propTypes = {
  onClose: PropTypes.func,
};

MoveListModal.defaultProps = {
  onClose: doNothing,
};

export default function MoveListModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor;
  return (
    <UniversalModal isVisible={props.isVisible} style={styles.modal} onBackdropPress={props.onClose}>
      <View style={styles.component}>
        <Text style={styles.header}>{'Move list'}</Text>
        <View style={styles.content}>
          <Text style={styles.label}>{'Project:'}</Text>
          <Picker selectedValue={props.selectedSpaceId} style={styles.picker} onValueChange={props.onSpaceChange}>
            {props.spaceIds.map((spaceId) => (
              <Picker.Item key={`moveListModalPicker_${spaceId}`} label={props.getLabel(spaceId)} value={spaceId} />
            ))}
          </Picker>
          <Text style={styles.label}>{'Position:'}</Text>
          <TextInput
            placeholder={'position'}
            keyboardType="numeric"
            underlineColorAndroid={color}
            style={styles.textInput}
            value={props.selectedPosition}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  );
}
