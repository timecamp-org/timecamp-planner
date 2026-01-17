import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';

import { Picker } from 'emoji-mart';

import { FaceSmile } from 'commonComponents/Icons/fontawesome/FaceSmile';
import UniversalModal from 'commonComponents/UniversalModal';
import SecondaryButton from 'components/buttons/SecondaryButton';
import styles from './styles.css';
import 'emoji-mart/css/emoji-mart.css';
import { useRef } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';

EmojiPicker.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonShadeClassName: PropTypes.string,
  color: PropTypes.string,
  buttonSize: PropTypes.number,
  isPickerOpen: PropTypes.bool,
  iconComponent: PropTypes.func,
  onEmojiPick: PropTypes.func,
  onSetIsEmojPickerOpen: PropTypes.func,
  onSetButtonRef: PropTypes.func,
  onSetModalRef: PropTypes.func,
  buttonRenderer: PropTypes.func,
};

EmojiPicker.defaultProps = {
  isPickerOpen: false,
  buttonSize: 18,
  onEmojiPick: doNothing,
  onSetIsEmojPickerOpen: doNothing,
  onSetButtonRef: doNothing,
  onSetModalRef: doNothing,
};

function EmojiPicker(props) {
  const emojiPickerRef = useRef<any>();
  useOnClickOutside(emojiPickerRef, () => {
    props.onSetIsEmojPickerOpen(false);
  });

  return (
    <div className={props.className || styles.Component}>
      <div onClick={() => props.onSetIsEmojPickerOpen(true)} ref={props.onSetButtonRef}>
        {props.buttonRenderer ? props.buttonRenderer(props) : renderButton(props)}
      </div>
      <UniversalModal
        innerModalDialogClassName={styles.modalDialog}
        backdropClassName={styles.backdrop}
        isModalOpen={props.isPickerOpen}
        modalTransitionDuration={0}
        shouldRenderHeader={false}
        dialogOffsetX={props.modalOffsetX}
        dialogOffsetY={props.modalOffsetY}
        shouldRenderCloseIcon={false}
        shouldRenderCancelButton={false}
        shouldRenderFooter={false}
        onSetIsModalOpen={props.onSetIsEmojPickerOpen}
        onSetInnerRef={(ref) => {
          props.onSetModalRef(ref);
          emojiPickerRef.current = ref;
        }}
      >
        <Picker onClick={props.onEmojiPick} autoFocus />
      </UniversalModal>
    </div>
  );
}

function renderButton(props) {
  const Icon = props.iconComponent || FaceSmile;
  return (
    <SecondaryButton
      isActive={props.isPickerOpen}
      activeClassName={styles.buttonActive}
      className={props.buttonClassName || styles.button}
      color={props.color}
      buttonShadeClassName={props.buttonShadeClassName}
    >
      <Icon width={props.buttonSize} height={props.buttonSize} />
    </SecondaryButton>
  );
}

export default EmojiPicker;
