import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import styles from './styles';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import PrimaryButton from 'commonComponents/PrimaryButton';

ConvertMessageToCard.propTypes = {
  spaceIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  listIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  cardName: PropTypes.string.isRequired,

  selectedSpaceId: PropTypes.string.isRequired,
  selectedListId: PropTypes.string.isRequired,

  getSpaceLabel: PropTypes.func.isRequired,
  getListLabel: PropTypes.func.isRequired,
  onSelectSpaceId: PropTypes.func.isRequired,
  onSelectListId: PropTypes.func.isRequired,
  onChangeCardName: PropTypes.func.isRequired,
  onConvertMessageToCard: PropTypes.func.isRequired,
  onCancelConvertMessageToCard: PropTypes.func.isRequired,
};

function ConvertMessageToCard(props) {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>{'Project'}</Text>
        <Picker selectedValue={props.selectedSpaceId} onValueChange={props.onSelectSpaceId}>
          {props.spaceIds.map((spaceId) => (
            <Picker.Item key={`convertMessage_space_${spaceId}`} label={props.getSpaceLabel(spaceId)} value={spaceId} />
          ))}
        </Picker>

        <Text style={styles.label}>{'List'}</Text>
        <Picker selectedValue={props.selectedListId} style={styles.picker} onValueChange={props.onSelectListId}>
          {props.listIds.map((listId) => (
            <Picker.Item
              key={`convertMessage_list_${listId}`}
              label={props.getListLabel(listId) || 'New list'}
              value={listId}
            />
          ))}
        </Picker>

        <Text style={styles.label}>{'Task name'}</Text>
        <TextInput value={props.cardName} onChangeText={props.onChangeCardName} multiline />

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.button} onPress={props.onCancelConvertMessageToCard}>
            <Text>{'Cancel'}</Text>
          </TouchableOpacity>
          <PrimaryButton text={'Convert'} onPress={props.onConvertMessageToCard} style={styles.button} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default ConvertMessageToCard;
