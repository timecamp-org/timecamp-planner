import React, { useState } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

import PersonFullName from '../../person/PersonFullName';
import ObjectName from './NotificationObjectName';
import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';

export type ChecklistItemAssigneeChangedInterface = {
  style?: AnyDict;
  wasAdded: boolean;

  actorId: string;
  userId: string;
  taskId: string;
  projectId: string;
  containerValue?: string;
  taskValue?: string;
  projectValue?: string;
};

const ChecklistItemAssigneeChanged: React.FC<ChecklistItemAssigneeChangedInterface> = (props) => {
  const [dupa, setDupa] = useState(true);
  return (
    <View style={props.style ? props.style : styles.Component}>
      {renderUserName(props.actorId, props.userId)}
      {props.wasAdded ? (
        <Text style={styles.textElement}>{'assigned'}</Text>
      ) : (
        <Text style={styles.textElement}>{'removed'}</Text>
      )}
      {renderUserName(props.userId, props.userId)}
      {props.wasAdded ? (
        <Text style={styles.textElement}>{'to'}</Text>
      ) : (
        <Text style={styles.textElement}>{'from'}</Text>
      )}
      <Text style={styles.textElement}>{'checklist item'}</Text>
      <Text style={styles.textElement}>{props.containerValue}</Text>
      <Text style={styles.textElement}>{'in task'}</Text>
      <ObjectName objectId={props.taskId} objectValue={props.taskValue} />
      <Text style={styles.textElement}>{' in '}</Text>
      <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
    </View>
  );
};

const renderUserName = (userId: Id, currentUserId: Id) => {
  if (currentUserId === userId) {
    return <Text style={styles.textElement}>{'you'}</Text>;
  } else {
    return <PersonFullName style={styles.userName} userId={userId} />;
  }
};

export default ChecklistItemAssigneeChanged;
