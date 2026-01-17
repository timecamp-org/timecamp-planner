import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles.css';

import { doNothing } from 'common/utils';
import UniversalModal from 'commonComponents/UniversalModal';
import PersonFullName from 'components/person/PersonFullName';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

AddUsersToProjectModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  userIds: ImmutablePropTypes.list.isRequired,
  color: PropTypes.string.isRequired,

  onCloseModal: PropTypes.func,
  onAddUsers: PropTypes.func,
};

AddUsersToProjectModal.defaultProps = {
  userIds: new List(),
  color: colorStyles.wisteriaColor,

  onCloseModal: doNothing,
  onAddUsers: doNothing,
};

function AddUsersToProjectModal(props) {
  const { t } = useTranslation();
  return (
    <UniversalModal
      modalBodyClassName={styles.modal}
      isModalOpen={true}
      onSetIsModalOpen={props.onCloseModal}
      onModalSave={props.onAddUsers}
      color={props.color}
      saveButtonCaption={t(`Add user`, { count: props.userIds.size })}
    >
      <div>{t(`Do you want to add`)}</div>
      {props.userIds.map((userId, index) => (
        <Fragment key={userId}>
          <PersonFullName className={styles.personFullName} userId={userId} />
          {props.userIds.size > 1 && props.userIds.size !== index + 1 ? (
            <div className={styles.colon}>{','}</div>
          ) : null}
        </Fragment>
      ))}
      <div className={styles.lastText}>{t(`to project?`)}</div>
    </UniversalModal>
  );
}

export default AddUsersToProjectModal;
