import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import UniversalModal from 'commonComponents/UniversalModal';

import styles, { pickerStyles } from './styles';
import { doNothing } from 'common/utils';

MoveAllCardsInListModal.propTypes = {
  onClose: PropTypes.func,
};

MoveAllCardsInListModal.defaultProps = {
  onClose: doNothing,
};

export default function MoveAllCardsInListModal(props) {
  return (
    <UniversalModal isVisible={props.isVisible} style={styles.modal} onBackdropPress={props.onClose}>
      <View style={styles.component}>
        <Text style={styles.header}>{'Move all tasks in this list...'}</Text>
        <View style={styles.content}>
          <PickerSelect
            items={props.listIds
              .toArray()
              .map((listId) => ({ label: props.listNames.get(listId), value: listId, key: listId }))}
            hideIcon
            style={pickerStyles}
            onValueChange={props.onListChange}
            value={props.selectedListId}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={props.onCancel}
            style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}
          >
            <Text style={styles.footerButtonText}>{'CANCEL'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text style={styles.footerButtonText}>{'OK'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  );
}
