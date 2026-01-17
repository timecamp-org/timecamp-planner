import { doNothing } from 'common/utils';
import UniversalPopover from 'commonComponents/UniversalPopover';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import PopoverContent from 'commonComponents/PopoverContent';
import { useTranslation } from '../../../../common/i18n';
import CreateCardModalContent from '../CreateCardModalContent';
import styles from './styles.css';

CreateCardPopover.propTypes = {
  projectId: PropTypes.string.isRequired,
  className: PropTypes.string,
  targetClassName: PropTypes.string,
  color: PropTypes.string,
  isPopoverOpened: PropTypes.bool,

  targetRenderer: PropTypes.object,
  onClickOutside: PropTypes.func,
};

CreateCardPopover.defaultProps = {
  className: '',
  onClosePopover: doNothing,
  onClickOutside: doNothing,
};

const titleWrapperSxProps = {
  display: 'flex',
  padding: '1rem',
  paddingBottom: 0,
  marginBottom: '1.5rem',
};

function CreateCardPopover(props) {
  const { t } = useTranslation();
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetClassName={props.targetClassName}
      targetComponent={props.targetRenderer}
      popperContentWrapperClassName={styles.popoverContent}
      popperComponent={renderContent(props, t)}
      shouldRenderArrow={false}
      popperPlacement={'top'}
      popperModifiers={{
        preventOverflow: {
          boundariesElement: 'window',
        },
      }}
    />
  );
}

function renderContent(props, t) {
  return (
    <PopoverContent
      isVisible={props.isPopoverOpened}
      className={props.className || styles.Component}
      onClickOutside={props.onClickOutside}
    >
      <Box sx={titleWrapperSxProps}>
        <span className={styles.title}>{t('Create a task')}</span>
      </Box>

      <CreateCardModalContent
        projectId={props.projectId}
        startDate={props.startDate}
        dueDate={props.dueDate}
        onClosePopover={props.onClosePopover}
        newTimeOffset={props.newTimeOffset}
        taskCreateSource={props.taskCreateSource}
      />
    </PopoverContent>
  );
}

export default CreateCardPopover;
