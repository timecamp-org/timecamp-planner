import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import styles from './styles.css';

import PersonFullName from 'components/person/PersonFullName';
import ObjectName from './NotificationObjectName';
import { List } from 'immutable';
import { useTranslation } from 'i18n';

ObjectStatusChangedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
};

ObjectStatusChangedText.defaultProps = {
  activityChanges: new List(),
};

function ObjectStatusChangedText(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      {props.activityChanges.map(renderChange)}
      <span className={styles.text}>
        {props.targetType === 'task' ? t('notification|a task') : t('notification|project')}
      </span>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </div>
  );

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />;
  }

  function renderChange(change) {
    const newValue = change.get('new');
    switch (newValue) {
      case 'archived': {
        return newValue;
      }
      case 'complete': {
        return t('notification|completed');
      }
      case 'incomplete': {
        return t('notification|uncompleted');
      }
      default: {
        return null;
      }
    }
  }
}

export default ObjectStatusChangedText;
