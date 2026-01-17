import React, { Fragment, memo, FC, useRef } from 'react';

import { List } from 'immutable';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import DateOutput from 'components/date/DateOutput/index';
import PersonFullName from 'components/person/PersonFullName';
import ProjectColorDotComponent from 'components/projects/ProjectColorDot/component';
import ProjectName from 'components/projects/projectName/ProjectName';
import TagName from 'components/tags/TagName';
import ListNameOutput from 'components/taskList/ListNameOutput';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput';
import TimeOutput from 'components/time/TimeOutput/index';
import { useTranslation } from 'i18n';
import { ActivityType } from 'models/domain/ActivitiesModel/constants/ActivityType';
import {
  selectActivity,
  selectFilteredActivityTypes,
  selectActivityChangedProps,
} from 'models/domain/ActivitiesModel/selectors';
import { TaskStatus } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { EntityStatus } from '../../../../common/models/domain/EntityModel/types';

import { ActivityWithChange } from './interfaces';
import styles from './styles.css';

const MAX_OUTPUT_LENGTH = 14;

interface PropsInterface {
  activityId: Id;
}

export const ActivityInChat: FC<PropsInterface> = ({ activityId }) => {
  const { t } = useTranslation();
  const currentUserId = useSelector(selectCurrentUserId);
  const innerRef = useRef();

  const activity = useSelector((state) => selectActivity(state, { activityId }));
  const activityType = useSelector((state) =>
    selectFilteredActivityTypes(state, {
      activityId,
    }),
  );

  const changes = useSelector((state) =>
    selectActivityChangedProps(state, {
      activityId,
    }),
  );

  return (
    <div ref={innerRef} className={styles.activity}>
      {renderActivityBody()}
      <span className={styles.activityTime}>
        <TimeOutput timestamp={activity.timestamp} shouldDisplayDate />
      </span>
    </div>
  );

  function renderActivityBody() {
    if (activityType instanceof List) {
      // activityType is List when
      // multiple changes come in 1 activity (for now only activity:changed)
      return renderMultiActivityBody(activityType as List<ActivityType>);
    }

    const SpanWithActingUserName = ({ children }) => (
      <span className={styles.activityBody}>
        {renderUser(activity.actingUserId)}
        {children}
      </span>
    );

    const isOwner = currentUserId === activity.actingUserId;

    switch (activityType) {
      case ActivityType.TASK_CREATED:
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| created this task ', { context: 'self' })
              : t('activity| created this task ', { context: 'other' })}
          </SpanWithActingUserName>
        );
      case ActivityType.PROJECT_CREATED:
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| created this project ', { context: 'self' })
              : t('activity| created this project ', { context: 'other' })}
          </SpanWithActingUserName>
        );
      case ActivityType.TASK_ADDED_TO_PROJECT:
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| added task ', { context: 'self' })
              : t('activity| added task ', { context: 'other' })}
            {renderTaskNameById(activity.objectId)}
            {t(' to project ')}
            {renderProjectNameById(activity.containerId)}
          </SpanWithActingUserName>
        );
      case ActivityType.PERSON_ADDED_TO_PROJECT:
        return (
          <SpanWithActingUserName>
            {isOwner ? t('activity| added ', { context: 'self' }) : t('activity| added ', { context: 'other' })}
            {renderUser(activity.objectId)}
            {t(' as a follower to this project ')}
          </SpanWithActingUserName>
        );
      case ActivityType.TAG_ADDED_TO_TASK:
        return (
          <SpanWithActingUserName>
            {isOwner ? t('activity| added tag ', { context: 'self' }) : t('activity| added tag ', { context: 'other' })}
            <TagName tagId={activity.objectId} />
          </SpanWithActingUserName>
        );
      case ActivityType.PROJECT_PERSON_REMOVED:
        return (
          <SpanWithActingUserName>
            {isOwner ? t('activity| removed ', { context: 'self' }) : t('activity| removed ', { context: 'other' })}
            {renderUser(activity.objectId)}
            {t(' from this project ')}
          </SpanWithActingUserName>
        );
      case ActivityType.PROJECT_TASK_REMOVED:
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| removed task ', { context: 'self' })
              : t('activity| removed task ', { context: 'other' })}
            {renderTaskNameById(activity.objectId)}
            {t(' from project ')}
            {renderProjectNameById(activity.containerId)}
          </SpanWithActingUserName>
        );
      case ActivityType.TASK_ASSIGNEE_ADDED: {
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| assigned task to ', { context: 'self_capital' })
              : t('activity| assigned task to ', { context: 'other' })}
            {activity.objectId
              ? renderUser(activity.objectId, true, isOwner, activity.actingUserId)
              : activity.objectValue}
          </SpanWithActingUserName>
        );
      }
      case ActivityType.TASK_ASSIGNEE_REMOVED: {
        return (
          <SpanWithActingUserName>
            {isOwner
              ? t('activity| removed ', { context: 'self_capital' })
              : t('activity| removed ', { context: 'other' })}
            {activity.objectId
              ? renderUser(activity.objectId, true, isOwner, activity.actingUserId)
              : activity.objectValue}
            {isOwner
              ? t('activity| from assignees', { context: 'self' })
              : t('activity| from assignees', { context: 'other' })}
          </SpanWithActingUserName>
        );
      }

      // ignore messages, they are shown as messages so no need to show them as activities
      case ActivityType.MESSAGE_ADDED_TO_TASK:
      case ActivityType.MESSAGE_ADDED_TO_PROJECT:
      default:
        return null;
    }
  }

  function renderMultiActivityBody(activityTypes: List<ActivityType>) {
    const body = activityTypes
      .map((type, index) => ({
        change: changes.get(index),
        activityType: type,
      }))
      .filter((activityItem) => !!activityItem.activityType)
      .map(renderChangesActivityBody);

    return (
      <span className={styles.activityBody}>
        {renderUser(activity.actingUserId)}
        {body}
      </span>
    );
  }

  function renderChangesActivityBody(
    // eslint-disable-next-line no-shadow
    { activityType, change }: ActivityWithChange,
    index: number,
  ) {
    const keyBase = `${activity.id}_`;
    const newValue = change.get('new');
    const oldValue = change.get('old');

    const isOwner = currentUserId === activity.actingUserId;

    const SpanWithAnd = ({ children }) => (
      <span>
        {index > 0 ? t(' and') : ''}
        {children}
      </span>
    );

    switch (activityType) {
      case ActivityType.TASK_DUEDATE_CHANGED:
      case ActivityType.PROJECT_DUEDATE_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| set the due date to ', { context: 'self' })
                : t('activity| set the due date to ', { context: 'other' })}
              {renderDate(newValue)}
            </SpanWithAnd>
          );
        } else if (!newValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| removed the due date ', { context: 'self' })
                : t('activity| removed the due date ', { context: 'other' })}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed the due date to ', { context: 'self' })
                : t('activity| changed the due date to ', { context: 'other' })}
              {renderDate(newValue)}
            </SpanWithAnd>
          );
        }

      case ActivityType.TASK_STARTDATE_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| set the start date to ', { context: 'self' })
                : t('activity| set the start date to ', { context: 'other' })}
              {renderDate(newValue)}
            </SpanWithAnd>
          );
        } else if (!newValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| removed the start date ', { context: 'self' })
                : t('activity| removed the start date ', { context: 'other' })}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed the start date to ', { context: 'self' })
                : t('activity| changed the start date to ', {
                    context: 'other',
                  })}
              {renderDate(newValue)}
            </SpanWithAnd>
          );
        }

      case ActivityType.TASK_NAME_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| set task name to ', { context: 'self' })
                : t('activity| set task name to ', { context: 'other' })}
              {renderTaskName(newValue)}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed task name from ', { context: 'self' })
                : t('activity| changed task name from ', { context: 'other' })}
              {renderTaskName(oldValue)}
              {t(' to ')}
              {renderTaskName(newValue)}
            </SpanWithAnd>
          );
        }

      case ActivityType.TASK_DESCRIPTION_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| added description ', { context: 'self' })
                : t('activity| added description ', { context: 'other' })}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed description ', { context: 'self' })
                : t('activity| changed description ', { context: 'other' })}
            </SpanWithAnd>
          );
        }
      case ActivityType.TASK_PRIORITY_TYPE_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t(' added task priority ', { context: 'self' })
                : t(' added task priority ', { context: 'other' })}
              {renderBoldValue(newValue)}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t(' changed task priority to ', { context: 'self' })
                : t(' changed task priority to ', { context: 'other' })}
              {renderBoldValue(newValue)}
            </SpanWithAnd>
          );
        }
      case ActivityType.TASK_PROGRESS_ESTIMATE_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {`
            ${
              isOwner
                ? t('activity| changed task progress into', { context: 'self' })
                : t('activity| changed task progress into', {
                    context: 'other',
                  })
            } 
            `}
            {renderBoldValue(`${newValue}%`)}
          </SpanWithAnd>
        );

      case ActivityType.TASK_STATUS_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {newValue === TaskStatus.COMPLETED ? (
              <Fragment>
                {renderBoldValue(
                  isOwner
                    ? t('activity|set| completed', { context: 'self' })
                    : t('activity|set| completed', { context: 'other' }),
                )}
                {t('activity| this task ')}
              </Fragment>
            ) : (
              <Fragment>
                {isOwner
                  ? t('activity| set this task to ', { context: 'self' })
                  : t('activity| set this task to ', { context: 'other' })}
                {renderBoldValue(t('activity| incomplete'))}
              </Fragment>
            )}
          </SpanWithAnd>
        );

      case ActivityType.TASK_ARCHIVED_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {newValue
              ? renderBoldValue(
                  isOwner
                    ? t('activity|set| archived', { context: 'self' })
                    : t('activity|set| archived', { context: 'other' }),
                )
              : renderBoldValue(
                  isOwner
                    ? t('activity|set| unarchived', { context: 'self' })
                    : t('activity|set| unarchived', { context: 'other' }),
                )}
            {t('activity| this task')}
          </SpanWithAnd>
        );

      case ActivityType.TASK_LABEL_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t('activity| moved this task ', { context: 'self' })
              : t('activity| moved this task ', { context: 'other' })}
            {oldValue ? (
              <Fragment>
                {t('from ')}
                {renderListNameById(oldValue)}
              </Fragment>
            ) : null}
            {t(' to ')}
            {renderListNameById(newValue)}
          </SpanWithAnd>
        );

      case ActivityType.TASK_PROJECT_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t('activity| moved this task ', { context: 'self' })
              : t('activity| moved this task ', { context: 'other' })}
            {oldValue ? (
              <Fragment>
                {t('from ')}
                {renderProjectNameById(oldValue)}
              </Fragment>
            ) : null}
            {t(' to ')}
            {renderProjectNameById(newValue)}
          </SpanWithAnd>
        );

      case ActivityType.CARD_POINTS_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| set points to ', { context: 'self' })
                : t('activity| set points to ', { context: 'other' })}
              {renderBoldValue(newValue)}
            </SpanWithAnd>
          );
        } else if (!newValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| removed points ', { context: 'self' })
                : t('activity| removed points ', { context: 'other' })}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed the points from ', {
                    context: 'self',
                  })
                : t('activity| changed the points from ', {
                    context: 'other',
                  })}
              {renderBoldValue(oldValue)}
              {t(' to ')}
              {renderBoldValue(newValue)}
            </SpanWithAnd>
          );
        }

      case ActivityType.CARD_TIME_ESTIMATES_CHANGED:
        if (!oldValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| set time estimates to ', { context: 'self' })
                : t('activity| set time estimates to ', { context: 'other' })}
              {renderBoldValue(`${newValue}${t('h')}`)}
            </SpanWithAnd>
          );
        } else if (!newValue) {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| removed time estimates ', { context: 'self' })
                : t('activity| removed time estimates ', { context: 'other' })}
            </SpanWithAnd>
          );
        } else {
          return (
            <SpanWithAnd key={`${keyBase}${activityType}`}>
              {isOwner
                ? t('activity| changed the time estimates from ', {
                    context: 'self',
                  })
                : t('activity| changed the time estimates from ', {
                    context: 'other',
                  })}
              {renderBoldValue(`${oldValue}${t('h')}`)}
              {t(' to ')}
              {renderBoldValue(`${newValue}${t('h')}`)}
            </SpanWithAnd>
          );
        }

      case ActivityType.PROJECT_NAME_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t(`activity| changed this project\'s name from `, {
                  context: 'self',
                })
              : t(`activity| changed this project\'s name from `, {
                  context: 'other',
                })}
            {renderProjectNameById(oldValue)}
            {t(' to ')}
            {renderProjectNameById(newValue)}
          </SpanWithAnd>
        );

      case ActivityType.PROJECT_DESCRIPTION_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t(`activity| changed this project\'s description `, {
                  context: 'self',
                })
              : t(`activity| changed this project\'s description `, {
                  context: 'other',
                })}
          </SpanWithAnd>
        );

      case ActivityType.PROJECT_COLOR_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t(`activity| changed this project\'s color from `, {
                  context: 'self',
                })
              : t(`activity| changed this project\'s color from `, {
                  context: 'other',
                })}
            <ProjectColorDotComponent projectColor={oldValue} />
            {t(' to ')}
            <ProjectColorDotComponent projectColor={newValue} />
          </SpanWithAnd>
        );

      case ActivityType.PROJECT_STARTDATE_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {isOwner
              ? t('activity| set the start date to ', { context: 'self' })
              : t('activity| set the start date to ', { context: 'other' })}
            {renderDate(newValue)}
          </SpanWithAnd>
        );

      case ActivityType.PROJECT_STATUS_CHANGED:
        return (
          <SpanWithAnd key={`${keyBase}${activityType}`}>
            {newValue === EntityStatus.ARCHIVED
              ? isOwner
                ? t('activity| archived this project ', { context: 'self' })
                : t('activity| archived this project ', { context: 'other' })
              : isOwner
              ? t('activity| unarchived this project ', { context: 'self' })
              : t('activity| unarchived this project ', { context: 'other' })}
          </SpanWithAnd>
        );
      default:
        return null;
    }
  }

  function renderUser(id: Id, renderExplicitYou = false, isOwner?: boolean, actingUserId?: Id) {
    const isCurrentUser = id === currentUserId;
    if (isCurrentUser) {
      return renderExplicitYou
        ? isOwner
          ? t('activity|You', { context: 'explicit_self' })
          : t('activity|You', { context: 'explicit' })
        : t('activity|You');
    } else {
      const isActingUserTarget = actingUserId && actingUserId === id;
      if (isActingUserTarget) {
        return t('activity|themselves');
      }
      return <PersonFullName userId={id} className={styles.personFullName} />;
    }
  }

  function renderTaskNameById(id: Id) {
    return <TaskNameOutput taskId={id} maxLength={MAX_OUTPUT_LENGTH} />;
  }

  function renderListNameById(id: Id) {
    return <ListNameOutput listId={id} maxLength={MAX_OUTPUT_LENGTH} className={styles.activityBoldText} />;
  }

  function renderTaskName(name: string) {
    return <TaskNameOutput taskName={name} maxLength={MAX_OUTPUT_LENGTH} />;
  }

  function renderProjectNameById(id) {
    return <ProjectName projectId={id} maxLength={MAX_OUTPUT_LENGTH} className={styles.activityBoldText} />;
  }

  function renderDate(timestamp) {
    return <DateOutput timestamp={timestamp} format={'MMM D'} className={styles.activityBoldText} />;
  }

  function renderBoldValue(value) {
    return <span className={styles.activityBoldText}>{value}</span>;
  }
};

export default memo(ActivityInChat);
