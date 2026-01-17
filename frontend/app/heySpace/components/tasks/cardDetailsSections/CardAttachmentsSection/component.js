import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import TaskAttachments from '../../TaskAttachments';

import styles from './styles.css';

CardAttachmentsSection.propTypes = {
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  isFocused: PropTypes.bool,

  onClick: PropTypes.func,
};

CardAttachmentsSection.defaultProps = {
  isFocused: false,

  onClick: doNothing,
};

function CardAttachmentsSection(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.right}>
        <TaskAttachments taskId={props.taskId} color={props.color} />
      </div>
    </div>
  );
}

export default CardAttachmentsSection;
