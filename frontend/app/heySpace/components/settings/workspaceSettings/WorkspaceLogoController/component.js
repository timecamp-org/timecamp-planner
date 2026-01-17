import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import InfoTooltip from 'commonComponents/InfoTooltip';
import { useTranslation } from 'i18n';

import commonStyles from 'styles/common.css';

import styles from './styles.css';

import styled from 'styles/styled';
import { Pen } from 'commonComponents/Icons/fontawesome/Pen';

const imageWrapperStyles = {
  width: '12rem',
  height: '12rem',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '&:hover>svg': {
    display: 'block',
  },
  '&:hover img ': {
    opacity: 0.2,
  },
  zIndex: 100,
};

const WorkspaceImage = styled.img`
  max-width: 100%;
  max-height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: fontFamilyTwo;
  font-weight: boldFontWeight;
  font-size: largeFontSize;

  border-radius: 8px;
  border: 1px solid cloudyBlueColor;

  margin-right: calc(gridCellSize * 5);
  cursor: pointer;
`;

WorkspaceLogoController.propTypes = {
  organizationId: PropTypes.string,
  className: PropTypes.string,
  isHovering: PropTypes.bool,
  isDisabled: PropTypes.bool,

  onOpenFilePrompt: PropTypes.func,
  onSetOpenCallback: PropTypes.func,
  onChooseFile: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

WorkspaceLogoController.defaultProps = {
  organizationId: null,
  className: '',
  isHovering: false,
  isDisabled: false,

  onSetOpenCallback: doNothing,
  onOpenFilePrompt: doNothing,
  onChooseFile: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function WorkspaceLogoController(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      {props.isDisabled ? renderButtonWithTooltip(props) : renderButton(props)}
      <DropzoneWrapper
        noClick
        noKeyboard
        style={{ visible: 'none' }}
        onSetOpenCallback={props.onSetOpenCallback}
        onDrop={props.onChooseFile}
      />
    </div>
  );

  function renderButton() {
    return (
      <Box
        sx={imageWrapperStyles}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onOpenFilePrompt}
      >
        {props.workspaceThumbnail ? (
          <WorkspaceImage src={props.workspaceThumbnail} />
        ) : (
          <div className={styles.initials}>{props.workspaceInitials}</div>
        )}

        <Pen className={styles.hoveredPen} size={'2xl'} />
      </Box>
    );
  }

  function renderButtonWithTooltip() {
    return (
      <InfoTooltip
        infoTooltipWrapperClassName={styles.infoTooltip}
        shouldRenderInfoTooltip={props.isHovering}
        popperPlacement={'top'}
        targetComponent={renderButton()}
        popperModifiers={{
          offset: {
            offset: `0, ${commonStyles.gridCellSize}`,
          },
        }}
        title={t(`You have to be workspace owner to change logo`)}
      />
    );
  }
}

export default WorkspaceLogoController;
