import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Droplet } from 'commonComponents/Icons/fontawesome/Droplet';
import InfoTooltip from 'commonComponents/InfoTooltip';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectColorDot from 'components/projects/ProjectColorDot/component';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const transitionDuration = 100;

EditTagColor.propTypes = {
  tagColor: PropTypes.string.isRequired,
  availableTagColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPopoverOpened: PropTypes.bool,
  isMouseOverButton: PropTypes.bool,
  onMouseEnterButton: PropTypes.func,
  onMouseLeaveButton: PropTypes.func,
  onChangeTagColor: PropTypes.func,
  onIconClick: PropTypes.func,
};

EditTagColor.defaultProps = {
  isPopoverOpened: false,
  onChangeTagColor: doNothing,
  isMouseOverButton: false,
  onMouseEnterButton: doNothing,
  onMouseLeaveButton: doNothing,
  onIconClick: doNothing,
};

function EditTagColor(props) {
  const { t } = useTranslation();

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={props.isMouseOverButton}
      popperPlacement={'bottom'}
      targetComponent={
        <UniversalPopover
          isPopoverOpened={props.isPopoverOpened}
          targetComponent={
            <SecondaryButton
              onClick={props.onIconClick}
              className={styles.button}
              onMouseEnter={props.onMouseEnterButton}
              onMouseLeave={props.onMouseLeaveButton}
            >
              <Droplet className={styles.icon} />
            </SecondaryButton>
          }
          popperComponent={
            <React.Fragment>
              <span className={styles.title}>{t('Change tag color')}</span>
              <div className={styles.colorPicker}>
                {props.availableTagColors.map((colorHex) => (
                  <div key={colorHex} onClick={() => props.onChangeTagColor(colorHex)}>
                    <ProjectColorDot
                      className={`${styles.colorDot}${
                        colorHex === props.tagColor ? ` ${styles.selectedColorDot}` : ''
                      }`}
                      innerClassName={styles.innerDot}
                      projectColor={colorHex}
                      projectId={''}
                      disabled={false}
                      shouldRenderTick={colorHex === props.tagColor}
                      shouldRenderInnerRing={false}
                    />
                  </div>
                ))}
              </div>
            </React.Fragment>
          }
          popperPlacement={'bottom'}
          popperModifiers={{
            offset: {
              offset: `0, 10`,
            },
          }}
          transitionDuration={0}
        />
      }
      message={t(`To use our awesome Tags upgrade to Premium!`)}
      transitionDuration={transitionDuration}
    />
  );
}

export default EditTagColor;
