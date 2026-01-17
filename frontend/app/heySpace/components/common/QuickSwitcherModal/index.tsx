import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Divider, SxProps, Tab, Tabs } from '@mui/material';

import { wisteriaColor } from 'common/commonStyles/colors';
import { SearchModal } from 'commonComponents/GlobalSearch/SearchModal';
import LoadingDots from 'commonComponents/LoadingDots';
import QuickSwitcherModalCardsContent from 'commonComponents/QuickSwitcherModalCardsContent';
import QuickSwitcherModalChatsContent from 'commonComponents/QuickSwitcherModalChatsContent';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';
import ABTestVisibilityWrapper from 'components/extensions/ABTestVisibilityWrapper';
import { useTranslation } from 'i18n';
import { TestGranulation, TestType } from 'models/component/ABTestsModel/types';
import { QuickSwitcherState } from 'models/domain/AppModel/types';

import { useComponent } from './hook';
import styles from './styles.css';

const tabsStyles: SxProps = {
  marginTop: '1.2em',
};

export interface QuickSwitcherModalInterface {
  quickSwitcherState: QuickSwitcherState;
}

export const QuickSwitcherModal: React.FC<QuickSwitcherModalInterface> = (props): React.ReactElement => {
  const { quickSwitcherState } = props;
  const { t } = useTranslation();
  const hook = useComponent(props);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>();

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onTabChange = (_, newValue: QuickSwitcherState) => {
    hook.onSetQuickSwitcherState(newValue);
  };

  const onHideModal = () => hook.onSetIsModalOpen(false);

  const onSetInputRef = (inputElement: HTMLInputElement) => {
    inputRef.current = inputElement;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <ABTestVisibilityWrapper
      testType={TestType.TIMECAMP_ORGANIZATION}
      granulation={TestGranulation.ORGANIZATION}
      baseComponent={
        <UniversalModal
          innerModalDialogClassName={styles.innerModalDialogClassName}
          modalBodyClassName={styles.modalBody}
          isModalOpen={true}
          shouldRenderFooter={false}
          header={t('Search chats, projects or tasks')}
          color={wisteriaColor}
          onSetIsModalOpen={hook.onSetIsModalOpen}
          className={styles.universalModal}
        >
          <>
            <UnderlinedInputWrapper>
              <UserInput
                className={styles.input}
                placeholder={t('Search...')}
                type="text"
                name={t('project search')}
                autoComplete={'off'}
                shouldPreventMousetrapCapture={false}
                value={searchValue}
                onChange={onSearchValueChange}
                onSetInnerRef={onSetInputRef}
              />
            </UnderlinedInputWrapper>
            <Tabs value={quickSwitcherState} onChange={onTabChange} sx={tabsStyles}>
              <Tab label={t('Chats')} value={QuickSwitcherState.CHATS} />
              <Tab label={t('Tasks')} value={QuickSwitcherState.CARDS} />
            </Tabs>
            <Divider variant="fullWidth" />
            {hook.isRequestLoading ? (
              <LoadingDots className={styles.loadingDots} />
            ) : props.quickSwitcherState === QuickSwitcherState.CHATS ? (
              // @ts-ignore
              <QuickSwitcherModalChatsContent onHideModal={onHideModal} searchValue={searchValue} />
            ) : (
              // @ts-ignore
              <QuickSwitcherModalCardsContent onHideModal={onHideModal} searchValue={searchValue} />
            )}
          </>
        </UniversalModal>
      }
    >
      <SearchModal isOpen onClose={onHideModal} />
    </ABTestVisibilityWrapper>
  );
};

function getTabSwitcherClassName(isSelected) {
  return isSelected ? styles.selectedTabSwitcher : styles.tabSwitcher;
}

export default QuickSwitcherModal;
