import { FC } from 'react';

import { Button } from '@mui/material';
import { Placement } from '@popperjs/core';

import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';
import InputIcon from 'commonComponents/InputIcon';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectName from 'components/projects/projectName/ProjectName/withTooltip';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import useComponent, { CardSpacePickerHookInterface } from './hook';
import styles from './styles.css';

export type CardSpacePickerInterface = {
  taskId: Id;
  itemClassName?: string;
  buttonClassName?: string;
  targetClassName?: string;
  popperPlacement?: Placement;
  popperModifiers?: AnyDict;
  nameLengthLimit?: number;
};

const DEFAULT_POPPER_MODIFIERS = {
  offset: {
    offset: '0, 8px',
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

const CardSpacePicker: FC<CardSpacePickerInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  return (
    <UniversalPopover
      isPopoverOpened={hook.isProjectPickerVisible}
      popperContentWrapperClassName={styles.project}
      targetClassName={props.targetClassName || styles.target}
      targetComponent={renderProjectTarget(props, hook)}
      popperComponent={renderProjectPicker(hook, t, props)}
      popperPlacement={props.popperPlacement}
      popperModifiers={props.popperModifiers || DEFAULT_POPPER_MODIFIERS}
    />
  );
};

function renderProjectTarget(props: CardSpacePickerInterface, hook: CardSpacePickerHookInterface) {
  return (
    <Button variant="text" className={props.buttonClassName || styles.button} onClick={hook.onClickProjectName}>
      {<ProjectName projectId={hook.projectId} className={styles.projectName} maxLength={props.nameLengthLimit} />}
    </Button>
  );
}

function renderProjectPicker(
  hook: CardSpacePickerHookInterface,
  t: TranslateFunction,
  props: CardSpacePickerInterface
) {
  return (
    <PopoverContent isVisible={hook.isProjectPickerVisible} onClickOutside={hook.onHideAllPickers}>
      <div className={styles.picker}>
        <div className={styles.pickerTitle}>{t('Change project')}</div>
        <InputIcon
          shouldFocusOnMount
          placeholder={t('Search projects')}
          onResetValue={() => {
            hook.onSetSearchFilter('');
          }}
          onChange={(e) => {
            hook.onSetSearchFilter(e.target.value);
          }}
        />

        <div className={styles.pickerList}>
          {hook.spaceIds.map((spaceId) => (
            <SecondaryButton
              key={`CardDetailsBreadcrumps_space${spaceId}`}
              className={styles.listItemButton}
              onClick={() => hook.onChangeSpace(spaceId)}
            >
              <ProjectName className={styles.listItem} projectId={spaceId} maxLength={35} />
            </SecondaryButton>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
}

export default CardSpacePicker;
