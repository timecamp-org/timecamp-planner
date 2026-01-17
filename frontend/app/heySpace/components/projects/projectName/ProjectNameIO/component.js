import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import ProjectConversationNames from 'components/projects/ProjectConversationNames';
import ProjectName from 'components/projects/projectName/ProjectName';
import ProjectNameInput from 'components/projects/projectName/ProjectNameInput/component';

import styles from './styles.css';

ProjectNameIO.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  showProjectNameInput: PropTypes.bool,
  maxLength: PropTypes.number,

  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onNameUpdate: PropTypes.func,
};

ProjectNameIO.defaultProps = {
  showProjectNameInput: false,

  onClick: doNothing,
  onFocus: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
  onKeyUp: doNothing,
  onNameUpdate: doNothing,
};

function ProjectNameIO(props) {
  return (
    <div className={props.className ? props.className : styles.Component}>
      {props.showProjectNameInput ? (
        <ProjectNameInput
          className={props.innerClassName}
          projectId={props.projectId}
          projectName={props.projectName}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
          onNameUpdate={props.onNameUpdate}
          autoFocus={true}
        />
      ) : (
        <div className={styles.projectNameWithDot} onClick={props.onClick}>
          {props.isConversation && props.projectName === '' ? (
            <ProjectConversationNames
              shouldTruncateText={false}
              projectId={props.projectId}
              className={styles.projectName}
            />
          ) : (
            <ProjectName
              projectId={props.projectId}
              className={styles.projectName}
              maxLength={props.maxLength}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectNameIO;
