import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import { CornerUpRight } from 'commonComponents/Icons';
import ProjectName from 'components/projects/projectName/ProjectName';
import { doNothing } from 'common/utils';
import { i18n } from 'i18n';

MessageConvertedToTaskInfo.propTypes = {
  taskId: PropTypes.string.isRequired,
  hasAccessToProject: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

MessageConvertedToTaskInfo.defaultProps = {
  hasAccessToProject: false,
  onClick: doNothing,
};

function MessageConvertedToTaskInfo(props) {
  return (
    <div
      className={`${styles.Component} ${props.hasAccessToProject ? styles.hasAccess : null}`}
      onClick={props.onClick}
    >
      <CornerUpRight className={styles.arrowIcon} />
      <div className={styles.text}>{i18n.t('Converted to task in project:')}</div>
      {props.hasAccessToProject ? <ProjectName taskId={props.taskId} /> : <div>{i18n.t('Private project')}</div>}
    </div>
  );
}

export default MessageConvertedToTaskInfo;
