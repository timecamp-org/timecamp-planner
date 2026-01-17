import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import UniversalModal from 'commonComponents/UniversalModal';

import styles from './styles';
import { doNothing } from 'common/utils';
import { wisteriaColor } from 'common/commonStyles/colors';

MoveAllCardsInListModal.propTypes = {
  onClose: PropTypes.func,
};

MoveAllCardsInListModal.defaultProps = {
  onClose: doNothing,
};

export default function MoveAllCardsInListModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor;
  return (
    <UniversalModal isVisible={props.isVisible} style={styles.modal} onBackdropPress={props.onClose}>
      <View style={styles.component}>
        <Text style={styles.header}>{'Move all tasks in this list...'}</Text>
        <View style={styles.content}>
          <Picker selectedValue={props.selectedListId} style={styles.picker} onValueChange={props.onListChange}>
            {props.listIds.map((listId) => (
              <Picker.Item key={`moveListModalPicker_${listId}`} label={props.getLabel(listId)} value={listId} />
            ))}
          </Picker>
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
