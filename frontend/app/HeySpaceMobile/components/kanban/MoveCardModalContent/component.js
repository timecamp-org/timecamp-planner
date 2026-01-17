import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles';

import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import NumericInput from 'commonComponents/NumericInput';

MoveCardModalContent.propTypes = {
  taskId: PropTypes.string.isRequired,
  spaceIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  selectedSpaceId: PropTypes.string,
  listIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  selectedListId: PropTypes.string,
  cardPosition: PropTypes.number.isRequired,

  onIncrementCardPosition: PropTypes.func.isRequired,
  onDecrementCardPosition: PropTypes.func.isRequired,
  getSpaceName: PropTypes.func.isRequired,
  getListName: PropTypes.func.isRequired,
  onSelectSpaceId: PropTypes.func.isRequired,
  onSelectListId: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirmMoveCard: PropTypes.func.isRequired,
};

function MoveCardModalContent(props) {
  return (
    <React.Fragment>
      <View style={styles.component}>
        <Text style={styles.header}>{'Move task'}</Text>

        <Text style={styles.pickerTitle}>{'Project:'}</Text>
        <Picker selectedValue={props.selectedSpaceId} style={styles.picker} onValueChange={props.onSelectSpaceId}>
          {props.spaceIds.map(renderSpacePickerItem)}
        </Picker>

        <Text style={styles.pickerTitle}>{'List:'}</Text>
        <Picker selectedValue={props.selectedListId} style={styles.picker} onValueChange={props.onSelectListId}>
          {props.listIds.map(renderListPickerItem)}
        </Picker>

        <Text style={styles.pickerTitle}>{'Position:'}</Text>
        <View style={styles.positionInputWrapper}>
          <NumericInput
            value={props.cardPosition}
            increment={props.onIncrementCardPosition}
            decrement={props.onDecrementCardPosition}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel}>
            <Text style={styles.footerButtonText}>{'CANCEL'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onConfirmMoveCard}>
            <Text style={styles.footerButtonText}>{'OK'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );

  function renderSpacePickerItem(spaceId) {
    return (
      <Picker.Item
        key={`moveCardPicker_${spaceId}`}
        label={props.getSpaceName(spaceId) || 'New Project'}
        value={spaceId}
      />
    );
  }

  function renderListPickerItem(listId) {
    return (
      <Picker.Item key={`moveCardPicker_${listId}`} label={props.getListName(listId) || 'New List'} value={listId} />
    );
  }
}

export default MoveCardModalContent;
