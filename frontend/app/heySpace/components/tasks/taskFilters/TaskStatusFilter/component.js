import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { RadioChecked, RadioNotChecked } from 'commonComponents/Icons';
import UniversalPopover from 'commonComponents/UniversalPopover';
import FiltersButtonWithCounter from 'components/tasks/taskFilters/FiltersButtonWithCounter';
import { useTranslation } from 'i18n';
import {
  TaskFiltersContainerType,
  TaskFiltersTargetType,
} from 'models/component/FiltersModel/types';

import styles from './styles.css';

TaskStatusFilter.propTypes = {
  className: PropTypes.string,
  taskStatusFilter: PropTypes.string,
  taskStatusOptions: PropTypes.array,
  onSelectStatusFilter: PropTypes.func,
};

TaskStatusFilter.defaultProps = {
  taskStatusFilter: null,
  taskStatusOptions: [],
  onSelectStatusFilter: doNothing,
};

function TaskStatusFilter(props) {
  const { t } = useTranslation();

  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={
        <div className={styles.filtersButton} onClick={props.onOpenPopover}>
          <FiltersButtonWithCounter
            containerType={TaskFiltersContainerType.PROJECT}
            containerId={props.projectId}
            targetType={TaskFiltersTargetType.KANBAN_VERTICAL}
          />
        </div>
      }
      popperComponent={
        <div className={props.className || styles.Component}>
          {props.taskStatusOptions.map((status) => (
            <button
              key={status.key}
              ref={(ref) => props.onSetRadioIconRef(ref, status.key)}
              className={styles.statusOption}
              onClick={() => props.onSelectStatusFilter(status.key)}
              onMouseDown={props.onMouseDown}
              onMouseUp={props.onMouseUp}
              onFocus={props.onFocus}
            >
              {props.taskStatusFilter === status.key ? (
                <RadioChecked />
              ) : (
                <RadioNotChecked />
              )}
              <div className={styles.label}>{t(status.label)}</div>
            </button>
          ))}
        </div>
      }
      popperContentWrapperClassName={styles.popperContent}
      popperPlacement={'bottom'}
      popperArrowShadowClassName={styles.popperArrowShadowClassName}
      popperArrowFillClassName={styles.popperArrowFillClassName}
      popperModifiers={{
        offset: {
          offset: `0, 10`,
        },
      }}
    />
  );
}

export default TaskStatusFilter;
