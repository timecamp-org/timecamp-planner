import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { List as ImmutableList } from 'immutable';
import { ellipsizeInTheEnd } from 'common/utils';

import MoveListModal from '../../kanban/MoveListModal';
import AddCardModal from '../../kanban/AddCardModal';
import CopyListModal from '../../kanban/CopyListModal';
import MoveAllCardsInListModal from '../../kanban/MoveAllCardsInListModal';
import EditListNameModal from '../../kanban/EditListNameModal';
import ListName from '../../list/ListName';
import ListOptions from '../../kanban/ListOptions';
import listOptionsEnum from './listOptionsEnum';

import Card from '../../kanban/Card';
import Add from 'Icons/Add';
import Eye from 'Icons/Eye';

import styles from './styles';
import { blueGreyColor, whiteTwoColor } from 'common/commonStyles/colors';

const EDIT_LIST_NAME = 'Edit list name';

List.propTypes = {
  listId: PropTypes.string.isRequired,
  taskIds: ImmutablePropTypes.listOf(PropTypes.string),
  usersToAssign: ImmutablePropTypes.listOf(PropTypes.string),
};

List.defaultProps = {
  taskIds: new ImmutableList(),
};

export default function List(props) {
  return (
    <View style={styles.component}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.listNameWrapper} onPress={() => props.onOpenModal(EDIT_LIST_NAME)}>
          <ListName styles={styles.listName} listId={props.listId} />
        </TouchableOpacity>
        {props.isUserFollowingList ? renderEyeIcon() : null}
        {props.isEstimatesExtensionEnabled && props.listEstimatedEffort > 0 ? renderEstimateEffort(props) : null}
        <ListOptions listId={props.listId} onSelectOption={props.onSelectOption} listOptions={props.listOptions} />
      </View>
      <ScrollView style={styles.taskList} nestedScrollEnabled>
        {props.taskIds.map(renderCard)}
      </ScrollView>
      <View style={styles.footer}>{renderAddCardButton()}</View>
      <MoveListModal
        listId={props.listId}
        isVisible={props.modalOpen === listOptionsEnum.MOVE_LIST}
        onClose={props.onCloseModal}
      />
      <MoveAllCardsInListModal
        listId={props.listId}
        isVisible={props.modalOpen === listOptionsEnum.MOVE_ALL_CARDS}
        onClose={props.onCloseModal}
      />
      <CopyListModal
        listId={props.listId}
        isVisible={props.modalOpen === listOptionsEnum.COPY_LIST}
        onClose={props.onCloseModal}
      />
      <AddCardModal
        createAtTheBeginning
        usersToAssign={props.usersToAssign}
        listId={props.listId}
        isVisible={props.modalOpen === listOptionsEnum.ADD_CARD}
        onClose={props.onCloseModal}
      />
      <EditListNameModal
        listId={props.listId}
        isVisible={props.modalOpen === EDIT_LIST_NAME}
        onClose={props.onCloseModal}
      />
    </View>
  );

  function renderEyeIcon() {
    return <Eye svgProps={{ style: styles.eyeIcon }} currentColor={blueGreyColor} />;
  }

  function renderCard(taskId) {
    return <Card key={`listCard_${taskId}`} taskId={taskId} />;
  }

  function renderEstimateEffort() {
    return <Text style={styles.estimateEffort}>{ellipsizeInTheEnd(props.listEstimatedEffort.toString(), 2)}</Text>;
  }

  function renderAddCardButton() {
    return (
      <TouchableOpacity style={styles.footer} onPress={() => props.onOpenModal(listOptionsEnum.ADD_CARD)}>
        <View style={styles.addIconWrapper}>
          <Add svgProps={{ style: styles.addIcon }} currentColor={whiteTwoColor} />
        </View>
        <Text style={styles.footerText}>{'Add task'}</Text>
      </TouchableOpacity>
    );
  }
}
