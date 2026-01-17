import { Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import { doNothing } from 'common/utils';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import { i18mark, i18n } from 'i18n';

import styles from './styles.css';

UniversalModal.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  backdropClassName: PropTypes.string,
  innerModalDialogClassName: PropTypes.string,
  innerModalFooterClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  saveButtonClassName: PropTypes.string,
  cancelButtonClassName: PropTypes.string,
  modalBodyClassName: PropTypes.string,
  transitionState: PropTypes.oneOf(['entering', 'entered', 'exiting', 'exited']).isRequired,
  shouldRenderCloseIcon: PropTypes.bool,
  shouldRenderCancelButton: PropTypes.bool,
  shouldRenderSaveButton: PropTypes.bool,
  shouldRenderHeader: PropTypes.bool,
  shouldRenderFooter: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  customWindowControls: PropTypes.element,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  footerButtonsColor: PropTypes.oneOf(['error', 'primary']),
  isModalOpen: PropTypes.bool.isRequired,
  isMinimized: PropTypes.bool,

  onBackdropClick: PropTypes.func.isRequired,
  onCloseIconClick: PropTypes.func.isRequired,
  onMaximizeIconClick: PropTypes.func,
  saveButtonCaption: PropTypes.string,
  cancelButtonCaption: PropTypes.string,
  dialogOffsetX: PropTypes.number,
  dialogOffsetY: PropTypes.number,

  onSetInnerRef: PropTypes.func,
  onModalCancel: PropTypes.func,
  onModalSave: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyDownCapture: PropTypes.func,
};

UniversalModal.defaultProps = {
  shouldRenderCloseIcon: true,
  shouldRenderCancelButton: true,
  shouldRenderSaveButton: true,
  shouldRenderHeader: true,
  shouldRenderFooter: true,
  isModalOpen: false,
  isMinimized: false,
  saveButtonCaption: i18mark('Save'),
  cancelButtonCaption: i18mark('Cancel'),
  footerButtonsColor: 'primary',

  onBackdropClick: doNothing,
  onModalCancel: doNothing,
  onMaximizeIconClick: doNothing,
  onCloseIconClick: doNothing,
  onSetInnerRef: doNothing,
  onKeyDown: doNothing,
  onKeyDownCapture: doNothing,
  onModalSave: doNothing,
};

function UniversalModal(props) {
  return (
    <Draggable disabled={!props.isMinimized} position={props.draggablePosition}>
      <div
        className={props.className || (props.isMinimized ? styles.MinimizedComponent : styles.Component)}
        onClick={(event) => {
          event.stopPropagation();
        }}
        id={'commonComponents/UniversalModal'}
        tabIndex={-1}
        onKeyDown={props.onKeyDown}
        onKeyDownCapture={props.onKeyDownCapture}
        ref={props.onSetRef}
      >
        <div className={styles.modalDialog}>
          <div
            ref={props.onSetInnerRef}
            style={{
              left: props.dialogOffsetX,
              top: props.dialogOffsetY,
            }}
            className={`${props.innerModalDialogClassName || styles.whiteModalBox} ${
              styles[`whiteModalBox--${props.transitionState}`]
            }`}
          >
            <div>
              {props.customWindowControls || renderDefaultWindowControls(props)}

              {props.shouldRenderHeader ? (
                <div className={props.headerClassName ? props.headerClassName : styles.modalHeader}>{props.header}</div>
              ) : null}
            </div>
            <div className={props.modalBodyClassName || styles.modalBody}>{props.children}</div>

            {props.shouldRenderFooter ? (props.footer ? props.footer : renderDefaultFooter(props)) : null}
          </div>
        </div>
        {props.isMinimized || renderBackdrop(props)}
      </div>
    </Draggable>
  );
}

const renderBackdrop = (props) => (
  <div
    className={`${props.backdropClassName || styles.backdrop} ${styles[`backdrop--${props.transitionState}`]}`}
    ref={props.onSetBackdrop}
    onClick={props.onBackdropClick}
  />
);

const renderDefaultFooter = (props) => (
  <div className={props.innerModalFooterClassName || styles.modalFooter}>
    {props.shouldRenderCancelButton ? (
      <Button
        variant="text"
        className={props.cancelButtonClassName}
        onClick={props.onModalCancel}
        color={props.footerButtonsColor}
      >
        {i18n.t(props.cancelButtonCaption)}
      </Button>
    ) : null}
    {props.shouldRenderSaveButton ? (
      <Button
        variant="contained"
        color={props.footerButtonsColor}
        className={props.saveButtonClassName || styles.saveButton}
        onClick={props.onModalSave}
      >
        {i18n.t(props.saveButtonCaption)}
      </Button>
    ) : null}
  </div>
);

const renderCloseIcon = (props) => (
  <IconButton onClick={props.onCloseIconClick} className={styles.closeButton}>
    <Xmark size="lg" />
  </IconButton>
);

const renderDefaultWindowControls = (props) => props.shouldRenderCloseIcon && renderCloseIcon(props);

export default UniversalModal;
