import { Fragment } from 'react';

import PropTypes from 'prop-types';

import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import PersonFullName from 'components/person/PersonFullName';
import ProjectIcon from 'components/projects/ProjectIcon';
import ProjectName from 'components/projects/projectName/ProjectName';
import { i18n } from 'i18n';

import styles from './styles.css';

const usersNameLimit = 3;

ConversationBeginning.propTypes = {
  userId: PropTypes.string,
  projectId: PropTypes.string,
  isTaskConversation: PropTypes.bool.isRequired,
  isUserOwnChat: PropTypes.bool.isRequired,
  isDirectChat: PropTypes.bool.isRequired,
  isGroupChat: PropTypes.bool.isRequired,
};

function ConversationBeginning(props) {
  return <div className={styles.Component}>{renderContent(props)}</div>;
}

function renderContent(props) {
  if (props.isUserOwnChat) {
    return (
      <Fragment>
        <div className={styles.personInfo}>
          <ProjectIcon className={styles.personIcon} projectId={props.projectId} />
          {renderConversationName(props)}
        </div>
        <div className={styles.message}>
          <div className={`${styles.textUserOwnConversation} ${styles.marginLeft}`}>
            <b>{i18n.t(`This is your project. `)}</b>
            {i18n.t('You can write down some notes, draft messages etc.')}
          </div>
        </div>
      </Fragment>
    );
  } else if (props.isGroupChat || props.isDirectChat) {
    return (
      <Fragment>
        <div className={styles.personInfo}>
          <ProjectIcon className={styles.personIcon} projectId={props.projectId} />
          {renderConversationName(props)}
        </div>
        <div className={styles.message}>
          <div className={`${styles.text} ${styles.marginLeft}`}>
            {i18n.t('This is the beginning of conversation')}
            {renderConversationName(props, true)}
          </div>
        </div>
      </Fragment>
    );
  } else if (props.isTaskConversation) {
    return (
      <div className={styles.message}>
        <div className={styles.text}>{i18n.t('This is the beginning of conversation in this task.')}</div>
      </div>
    );
  } else {
    return (
      <div className={styles.message}>
        <ColoredProjectIcon projectId={props.projectId} />
        <div className={styles.messageText}>
          <span>{i18n.t('This is the beginning of conversation in project: ')}</span>
          <ProjectName projectId={props.projectId} className={styles.projectName} />
        </div>
      </div>
    );
  }
}

function renderConversationName({ t, ...props }, shouldInsertConjunctive = false) {
  return props.projectName && props.projectName.length > 0 ? (
    <ProjectName projectId={props.projectId} className={styles.conversationName} />
  ) : (
    <Fragment>
      {`${shouldInsertConjunctive ? i18n.t(' with ') : ''}`}
      {renderUsersName(props)}
    </Fragment>
  );
}

function renderUsersName(props) {
  const userIds = props.userIds.slice(0, usersNameLimit);

  return (
    <div className={styles.usersName}>
      {userIds.map((userId, index) => (
        <Fragment key={`ConversationBeginning_${userId}`}>
          <PersonFullName userId={userId} className={styles.personName} />
          {index !== userIds.size - 1 ? ', ' : null}
        </Fragment>
      ))}
      {props.userIds.size - 1 > usersNameLimit ? '...' : null}
    </div>
  );
}

export default ConversationBeginning;
