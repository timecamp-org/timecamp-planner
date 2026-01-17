import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';

import { doNothing } from 'common/utils';
import focusAppContent from 'common/utils/focusAppContent';
import BaseComponent from 'commonEnhancers/BaseComponent';
import colorStyles from 'styles/colors.css';
import commonStyles from 'styles/common.css';

const modalRoot = document.getElementById('modal-root');
const popperRoot = document.getElementById('popper-root');

function Enhance(ComposedComponent) {
  class EnhanceUniversalModal extends BaseComponent {
    static propTypes = {
      color: PropTypes.string,
      isModalOpen: PropTypes.bool,
      modalTransitionDuration: PropTypes.number,
      shouldFocusOnOpen: PropTypes.bool,
      shouldSaveOnEnter: PropTypes.bool,
      isMinimized: PropTypes.bool,
      shouldCloseOnBackdropClick: PropTypes.bool,

      onModalSave: PropTypes.func.isRequired,
      onSetIsModalOpen: PropTypes.func.isRequired,
      onSetInnerRef: PropTypes.func,
      onSetIsMinimized: PropTypes.func,
      modalBodyClassName: PropTypes.string,
    };

    static defaultProps = {
      color: colorStyles.wisteriaColor,
      shouldFocusOnOpen: false,
      shouldSaveOnEnter: false,
      isModalOpen: false,
      isMinimized: false,
      shouldCloseOnBackdropClick: true,
      modalTransitionDuration: parseInt(commonStyles.modalTransitionDuration),

      onModalSave: doNothing,
      onSetIsModalOpen: doNothing,
      onSetIsMinimized: doNothing,
    };

    constructor(props) {
      super(props);
      this.el = document.createElement('div');
    }

    state = {
      draggablePosition: null,
    };

    render() {
      return ReactDOM.createPortal(
        <Transition in={this.props.isModalOpen} timeout={this.props.modalTransitionDuration} mountOnEnter unmountOnExit>
          {(state) => (
            <ComposedComponent
              color={this.props.color}
              className={this.props.className}
              outerModalDialogClassName={this.props.outerModalDialogClassName}
              innerModalDialogClassName={this.props.innerModalDialogClassName}
              innerModalFooterClassName={this.props.innerModalFooterClassName}
              headerClassName={this.props.headerClassName}
              backdropClassName={this.props.backdropClassName}
              saveButtonClassName={this.props.saveButtonClassName}
              cancelButtonClassName={this.props.cancelButtonClassName}
              modalBodyClassName={this.props.modalBodyClassName}
              transitionState={state}
              isModalOpen={this.props.isModalOpen}
              isMinimized={this.props.isMinimized}
              draggablePosition={this.state.draggablePosition}
              shouldRenderCloseIcon={this.props.shouldRenderCloseIcon}
              shouldRenderCancelButton={this.props.shouldRenderCancelButton}
              shouldRenderSaveButton={this.props.shouldRenderSaveButton}
              shouldRenderHeader={this.props.shouldRenderHeader}
              shouldRenderFooter={this.props.shouldRenderFooter}
              header={this.props.header}
              customWindowControls={this.props.customWindowControls}
              footer={this.props.footer}
              footerButtonsColor={this.props.footerButtonsColor}
              children={this.props.children}
              saveButtonCaption={this.props.saveButtonCaption}
              cancelButtonCaption={this.props.cancelButtonCaption}
              dialogOffsetX={this.props.dialogOffsetX}
              dialogOffsetY={this.props.dialogOffsetY}
              onSetIsModalOpen={this.props.onSetIsModalOpen}
              onCloseIconClick={this.onCloseIconClick}
              onBackdropClick={this.onBackdropClick}
              onModalSave={this.onModalSave}
              onSetBackdrop={this.onSetBackdrop}
              onSetInnerRef={this.props.onSetInnerRef}
              onKeyDown={this.onKeyDown}
              onKeyDownCapture={this.onKeyDownCapture}
              onModalCancel={this.onModalCancel}
              onSetRef={this.onSetRef}
            />
          )}
        </Transition>,
        this.el,
      );
    }

    onSetRef(ref) {
      this.ref = ref;
    }

    onCloseModal() {
      this.props.onSetIsModalOpen(false);
    }

    onModalCancel() {
      this.onCloseModal();
      if (this.props.onModalCancel) {
        this.props.onModalCancel();
      }
    }

    onCloseIconClick() {
      this.onCloseModal();
      if (this.appContentNode) {
        this.appContentNode.focus();
      }
    }

    onBackdropClick(event) {
      if (event.target === this.backdrop && this.props.shouldCloseOnBackdropClick) {
        this.onCloseModal();
      }
    }

    onModalSave() {
      this.props.onModalSave();
      this.onCloseModal();
    }

    onKeyDown(event) {
      if (event.key === 'Escape' && this.props.isModalOpen && popperRoot.childElementCount === 0) {
        this.onCloseModal();
        focusAppContent();
        event.stopPropagation();
        event.preventDefault();
      }

      if (event.key === 'Enter' && this.props.shouldSaveOnEnter) {
        this.onModalSave();
      }
    }

    onKeyDownCapture(event) {
      if (
        event.key === 'Escape' &&
        this.props.isModalOpen &&
        popperRoot.childElementCount === 0 &&
        this.isOnlyOneModalOpen()
      ) {
        this.onCloseModal();
        focusAppContent();
      }
    }

    isOnlyOneModalOpen() {
      let openModalsCount = 0;

      for (let index = 0; index < modalRoot.childElementCount; index++) {
        if (modalRoot.children.item(index).childElementCount > 0) {
          openModalsCount++;
        }
      }

      return openModalsCount === 1;
    }

    onSetBackdrop(node) {
      this.backdrop = node;
    }

    appendElement() {
      if (modalRoot) {
        modalRoot.appendChild(this.el);
      }
    }

    removeElement() {
      if (modalRoot) {
        setImmediate(() => {
          if (modalRoot.contains(this.el)) {
            modalRoot.removeChild(this.el);
          }
        });
      }
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.isModalOpen && this.props.isModalOpen && this.ref && this.props.shouldFocusOnOpen) {
        this.ref.focus();
      }

      if (prevProps.isMinimized && !this.props.isMinimized) {
        this.setState({ draggablePosition: { x: 0, y: 0 } });
      } else if (!prevProps.isMinimized && this.props.isMinimized) {
        this.setState({ draggablePosition: null });
      }
    }

    componentDidMount() {
      this.appendElement();

      if (this.ref && this.props.shouldFocusOnOpen) {
        this.ref.focus();
      }

      this.appContentNode = document.getElementById('appContent');
    }

    componentWillUnmount() {
      this.removeElement();
    }
  }

  return EnhanceUniversalModal;
}

export default Enhance;
