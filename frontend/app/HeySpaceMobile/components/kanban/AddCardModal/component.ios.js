import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import UniversalModal from 'commonComponents/UniversalModal';

import ListName from '../../list/ListName';
import ProjectName from '../../projects/ProjectName';

import styles from './styles';
import { doNothing } from 'common/utils';
import { wisteriaColor } from 'common/commonStyles/colors';

AddCardModal.propTypes = {
  onClose: PropTypes.func,
};

AddCardModal.defaultProps = {
  onClose: doNothing,
};

export default function AddCardModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor;
  return (
    <UniversalModal isVisible={props.isVisible} style={styles.modal} onBackdropPress={props.onClose}>
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'Create a new task'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          <ProjectName projectId={props.projectId} />
          {' / '}
          <ListName listId={props.listId} />
        </Text>
        <View style={styles.content}>
          <TextInput
            placeholder={'name'}
            underlineColorAndroid={color}
            style={styles.textInput}
            multiline
            autoFocus
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={props.onCancel}
            style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}
          >
            <Text
              style={{
                ...styles.footerButtonText,
              }}
            >
              {'Cancel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
              }}
            >
              {'Add task'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  );
}
