import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import InfoTooltip from 'commonComponents/InfoTooltip';
import TagsInput from 'components/tags/TagsInput';
import { i18n } from 'i18n';

import styles from './styles.css';

CardTagsSection.propTypes = {
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  isFocused: PropTypes.bool,
  isHoveringNoAccessWrapper: PropTypes.bool,
  hasAccessToTags: PropTypes.bool,

  onClick: PropTypes.func,
  onSetIsFocused: PropTypes.func,
  onSetIsHoveringNoAccessWrapper: PropTypes.func,
};

CardTagsSection.defaultProps = {
  isFocused: false,
  isHoveringNoAccessWrapper: false,
  hasAccessToTags: false,

  onClick: doNothing,
  onSetIsFocused: doNothing,
  onSetIsHoveringNoAccessWrapper: doNothing,
};

const transitionDuration = 100;

function CardTagsSection(props) {
  if (props.hasAccessToTags) {
    return renderTagController();
  } else {
    return haveNoAccessWrapper(renderTagController());
  }

  function haveNoAccessWrapper(targetComponent) {
    return (
      <div className={styles.noAccessWrapper}>
        <InfoTooltip
          shouldRenderInfoTooltip={props.isHoveringNoAccessWrapper}
          popperPlacement={'bottom'}
          targetComponent={targetComponent}
          message={i18n.t(`To use our awesome Tags upgrade to Premium!`)}
          transitionDuration={transitionDuration}
        />
        <div
          className={styles.backdrop}
          onMouseEnter={() => props.onSetIsHoveringNoAccessWrapper(true)}
          onMouseLeave={() => props.onSetIsHoveringNoAccessWrapper(false)}
        ></div>
      </div>
    );
  }

  function renderTagController() {
    return (
      <div className={props.className || styles.Component}>
        <div className={styles.tagsControllerSectionRight}>
          <TagsInput
            tagsWrapperClassName={styles.tagsWrapperClassName}
            className={styles.taskTags}
            focusedClassName={styles.taskTagsFocused}
            objectId={props.taskId}
            shouldFocusOnMount={false}
            isFocused={props.isFocused}
            onSetIsFocused={props.onSetIsFocused}
          />
        </div>
        <ButtonBase className={styles.button} color={props.color} onClick={props.onClick}>
          <Tags size="sm" />
        </ButtonBase>
      </div>
    );
  }
}

export default CardTagsSection;
