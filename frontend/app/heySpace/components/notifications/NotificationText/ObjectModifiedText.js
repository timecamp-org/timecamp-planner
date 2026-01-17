import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import styles from './styles.css';
import { ellipsizeInTheEnd } from 'common/utils';

import PersonFullName from 'components/person/PersonFullName';
import ObjectName from './NotificationObjectName';
import ObjectType from './NotificationObjectType';
import DateOutput from 'components/date/DateOutput';
import { List } from 'immutable';
import { useTranslation, i18n } from 'i18n';

const propertiesWithoutValues = ['color'];

ObjectModifiedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
};

ObjectModifiedText.defaultProps = {
  activityChanges: new List(),
};

function ObjectModifiedText(props) {
  const { t } = useTranslation();
  const changeStatuses = getChangeStatuses();
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      {props.activityChanges.map(renderChange)}
      <span className={styles.text}>{renderObjectPrefix()}</span>
      <ObjectType
        objectId={props.targetId}
        objectType={props.targetType}
        objectValue={props.targetValue}
        context={getObjectLangContext()}
      />
      {props.projectId ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.projectId ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </div>
  );

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />;
  }

  function renderChange(change, idx) {
    const propertyName = change.get('propertyName');
    const changeStatus = getChangeStatus(change);
    if (needsPropertyValue(propertyName)) {
      return (
        <div key={idx}>
          {changeStatus === 'removed' ? renderRemovedChange(change, idx) : renderSetOrModifyChange(change, idx)}
        </div>
      );
    } else {
      return renderPropertyName(change, idx);
    }
  }

  function renderRemovedChange(change) {
    const propertyName = change.get('propertyName');
    const humanReadableProperty = getHumanReadableProperty(propertyName);
    const changeStatus = getChangeStatus(change);
    const changeStatusDisplay = t(`${changeStatuses[changeStatus]}`);
    return (
      <span className={styles.text}>
        {t(`notification|{{changeStatus}} the {{propertyName}}`, {
          changeStatus: changeStatusDisplay,
          propertyName: humanReadableProperty,
        })}
      </span>
    );
  }

  function renderSetOrModifyChange(change, idx) {
    const propertyName = change.get('propertyName');
    const humanReadableProperty = getHumanReadableProperty(propertyName);
    const changeStatus = getChangeStatus(change);
    const changeStatusDisplay = t(changeStatuses[changeStatus]);
    return (
      <Fragment>
        <span className={styles.text}>
          {t(`notification|{{changeStatus}} the {{propertyName}} to`, {
            changeStatus: changeStatusDisplay,
            propertyName: humanReadableProperty,
          })}
        </span>
        {renderChangeValue(change)}
        {shouldRenderComma(idx) ? <span className={styles.comma}>{','}</span> : null}
      </Fragment>
    );
  }

  function renderPropertyName(change, idx) {
    const propertyName = change.get('propertyName');
    const changeStatus = getChangeStatus(change);
    const changeStatusDisplay = t(changeStatuses[changeStatus]);
    const humanReadableProperty = getHumanReadableProperty(propertyName);
    return (
      <div key={idx}>
        <span className={styles.text}>
          {t(`notification|{{changeStatus}} the {{propertyName}}`, {
            changeStatus: changeStatusDisplay,
            propertyName: humanReadableProperty,
          })}
        </span>
        {shouldRenderComma(idx) ? <span className={styles.comma}>{','}</span> : null}
      </div>
    );
  }

  function needsPropertyValue(property) {
    return !propertiesWithoutValues.includes(property);
  }

  function renderChangeValue(change) {
    const newValue = change.get('new');
    switch (change.get('propertyName')) {
      case 'startDate':
      case 'endDate':
      case 'dueDate':
        return <DateOutput timestamp={newValue} format={'MMM D'} />;
      default:
        return ellipsizeInTheEnd(newValue ? `${newValue}` : '', 18);
    }
  }

  function renderObjectPrefix() {
    const status = getLastChangeStatus();
    switch (status) {
      case 'removed':
        return t(' from');
      case 'set':
      case 'changed':
        return t('notification|change| to');
      default:
        return null;
    }
  }

  function getChangeStatus(change) {
    const newValue = change.get('new');
    const oldValue = change.get('old');
    if ((!oldValue || oldValue === '') && newValue && newValue !== '') {
      return 'set';
    } else if (oldValue && oldValue !== '' && (!newValue || newValue === '')) {
      return 'removed';
    } else {
      return 'changed';
    }
  }

  function shouldRenderComma(changeId) {
    return !isLastChange(changeId) && props.activityChanges.size > 1;
  }

  function isLastChange(changeId) {
    return changeId === props.activityChanges.size - 1 && changeId > 0;
  }

  function getLastChangeStatus() {
    const change = props.activityChanges.last();
    return getChangeStatus(change);
  }

  function getObjectLangContext() {
    const status = getLastChangeStatus();
    switch (status) {
      case 'removed':
        return 'from';
      case 'set':
      case 'changed':
        return 'in';
      default:
        return null;
    }
  }

  function getHumanReadableProperty(property) {
    const changeProperties = {
      startDate: i18n.t('notification|start date'),
      endDate: i18n.t('notification|end date'),
      dueDate: i18n.t('notification|due date'),
      status: i18n.t('notification|status'),
    };
    return t(changeProperties[property]);
  }
}

function getChangeStatuses() {
  return {
    set: i18n.t('notification|set'),
    removed: i18n.t('notification|removed'),
    changed: i18n.t('notification|changed'),
  };
}

export default ObjectModifiedText;
