import { FC, useState } from 'react';

import { Button, IconButton } from '@mui/material';
import { Placement } from '@popperjs/core';
import fuzzysearch from 'fuzzysearch';

import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import InputIcon from 'commonComponents/InputIcon';
import ListItemAssign from 'commonComponents/ListItemAssign';
import LoadingDots from 'commonComponents/LoadingDots/component';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import ListNameOutput from 'components/taskList/ListNameOutput/withTooltip';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import useComponent, { CardListPickerHookInterface } from './hook';
import styles from './styles.css';

export type CardListPickerInterface = {
  taskId: Id;
  itemClassName?: string;
  targetClassName?: string;
  popperPlacement?: Placement;
  popperModifiers?: AnyDict;
  nameLengthDisplayLimit?: number;
};

const CardListPicker: FC<CardListPickerInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  return (
    <UniversalPopover
      isPopoverOpened={hook.isSectionPickerVisible}
      popperContentWrapperClassName={styles.section}
      targetClassName={props.targetClassName || styles.target}
      targetComponent={renderSectionTarget(props, hook)}
      popperComponent={renderSectionPicker(hook, t)}
      popperPlacement={props.popperPlacement}
      popperModifiers={props.popperModifiers}
    />
  );
};

function renderSectionTarget(props: CardListPickerInterface, hook: CardListPickerHookInterface) {
  return (
    <Button
      variant="text"
      className={props.itemClassName || styles.item}
      onClick={hook.onClickSectionName}
      style={{ color: hook.isSectionPickerVisible ? 'var(--color-primary-500)' : '' }}
    >
      {<ListNameOutput listId={hook.listId} maxLength={props.nameLengthDisplayLimit} />}
    </Button>
  );
}

function renderSectionPicker(hook: CardListPickerHookInterface, t: TranslateFunction) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <PopoverContent isVisible={hook.isSectionPickerVisible} onClickOutside={hook.onHideAllPickers}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>{t('Change List')}</div>
          <IconButton onClick={hook.onHideAllPickers}>
            <Xmark />
          </IconButton>
        </div>
        <InputIcon placeholder={t('Search list')} onChange={(e) => setSearchValue(e.target.value)} />
        <div className={styles.pickerList}>
          {hook.isGetProjectViewDataSuccess
            ? hook.listsData
                .filter(({ name }) => fuzzysearch(searchValue.toLowerCase(), name.toLowerCase()))
                .map(renderList)
            : renderLoadingDots(hook)}
        </div>
      </div>
    </PopoverContent>
  );

  function renderList({ id, name }: { id: Id; name: string }) {
    return (
      <ListItemAssign
        key={id}
        onClick={() => hook.onChangeSection(id)}
        label={<ListNameOutput className={styles.listItem} listId={id} maxLength={35} />}
      />
    );
  }
}

function renderLoadingDots(hook: CardListPickerHookInterface) {
  return <LoadingDots style={{ color: hook.projectColor }} className={styles.loadingDots} />;
}

export default CardListPicker;
