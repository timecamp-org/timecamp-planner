import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import styles from './styles.css';

import PersonFullName from 'components/person/PersonFullName';
import ObjectName from './NotificationObjectName';
import { useTranslation } from 'i18n';

ObjectProgressChangedText.propTypes = {
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

ObjectProgressChangedText.defaultProps = {};

function ObjectProgressChangedText(props) {
  const { t } = useTranslation();
  const progressChange = props.activityChanges.find((change) => change.get('propertyName') === 'progress');
  let newProgress;
  if (progressChange) {
    newProgress = progressChange.get('new');
  }
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      <span className={styles.text}>
        {t(`notification|changed task progress into {{progress}}% on`, { progress: newProgress })}
      </span>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </div>
  );

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />;
  }
}

export default ObjectProgressChangedText;
