import React from 'react';
import styles from './styles.css';

import PersonFullName from '../../person/PersonFullName';
import ObjectName from './NotificationObjectName';
import { useTranslation } from 'i18n';

export type ChecklistItemAssigneeChangedInterface = {
  className?: string;
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
  const { t } = useTranslation();

  return (
    <div className={props.className ? props.className : styles.Component}>
      {renderUserName(props.actorId)}
      {props.wasAdded ? (
        <span className={styles.text}>{t('notification|assigned ')}</span>
      ) : (
        <span className={styles.text}>{t('notification|removed_assignment ')}</span>
      )}
      {renderUserName(props.userId)}
      {props.wasAdded ? (
        <span className={styles.text}>{t('notification|assigned_to')}</span>
      ) : (
        <span className={styles.text}>{t('notification|assigned_from')}</span>
      )}
      <span className={styles.text}>{t(' checklist item ')}</span>
      <span className={styles.text}>{props.containerValue}</span>
      <span className={styles.text}>{t(' in task ')}</span>
      <ObjectName objectId={props.taskId} objectValue={props.taskValue} />
      <span className={styles.text}>{t(' in ')}</span>
      <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
    </div>
  );

  function renderUserName(userId) {
    if (props.userId === userId) {
      return <span className={styles.text}>{t('notification| you ')}</span>;
    } else {
      return <PersonFullName className={styles.userName} userId={userId} />;
    }
  }
};

export default ChecklistItemAssigneeChanged;
