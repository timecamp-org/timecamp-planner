import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UniversalModal from 'commonComponents/UniversalModal';

import styles, { pickerStyles } from './styles';
import { doNothing } from 'common/utils';

import PickerSelect from 'react-native-picker-select';
import TaskName from '../../tasks/TaskName';
import NumericInput from 'commonComponents/NumericInput';

IOSMoveCardModal.propTypes = {
  isVisible: PropTypes.bool,

  spacePickerOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  listPickerOptions: PropTypes.arrayOf(PropTypes.string).isRequired,

  selectedSpaceId: PropTypes.string.isRequired,
  selectedListId: PropTypes.string.isRequired,
  cardPosition: PropTypes.number.isRequired,

  onSelectSpaceId: PropTypes.func,
  onSelectListId: PropTypes.func,
  onIncrementCardPosition: PropTypes.func,
  onDecrementCardPosition: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

const spacePickerPlaceholder = { label: 'New project', value: null };
const listPickerPlaceholder = { label: 'New list', value: null };

IOSMoveCardModal.defaultProps = {
  isVisible: false,
  onClose: doNothing,
};

export default function IOSMoveCardModal(props) {
  return (
    <UniversalModal isVisible={props.isVisible} style={styles.modal} onBackdropPress={props.onClose}>
      <View style={styles.component}>
        <Text style={styles.header}>{'Move task'}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          <TaskName taskId={props.taskId} />
        </Text>
        <View style={styles.content}>
          <PickerSelect
            items={props.spacePickerOptions}
            hideIcon
            style={pickerStyles}
            onValueChange={props.onSelectSpaceId}
            value={props.selectedSpaceId}
            placeholder={!props.selectedSpaceId ? spacePickerPlaceholder : {}} // empty obj as placeholder = disabled placeholder :/
          />

          <PickerSelect
            items={props.listPickerOptions}
            hideIcon
            style={pickerStyles}
            onValueChange={props.onSelectListId}
            value={props.selectedListId}
            placeholder={!props.selectedListId ? listPickerPlaceholder : {}}
          />

          <Text style={styles.subtitle}>{'Position:'}</Text>
          <View style={styles.positionInputWrapper}>
            <NumericInput
              value={props.cardPosition}
              increment={props.onIncrementCardPosition}
              decrement={props.onDecrementCardPosition}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={props.onClose}
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
