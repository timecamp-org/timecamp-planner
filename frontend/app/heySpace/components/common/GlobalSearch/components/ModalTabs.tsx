import { FC, SyntheticEvent } from 'react';

import { SxProps, Tab, Tabs } from '@mui/material';

import { useTranslation } from 'common/i18n/index';

import { GlobalSearchResource } from '../types';

interface ModalTabsInterface {
  currentTab: string;
  onChange: (event: SyntheticEvent<Element, Event>, value: string) => void;
}

const tabsStyles: SxProps = {
  marginTop: '1.2em',
};

export const ModalTabs: FC<ModalTabsInterface> = ({ currentTab, onChange }) => {
  const { t } = useTranslation();

  return (
    <Tabs value={currentTab} onChange={onChange} sx={tabsStyles}>
      <Tab label={t('Messages')} value={GlobalSearchResource.MESSAGE} />
      <Tab label={t('Tasks')} value={GlobalSearchResource.TASK} />
      <Tab label={t('Projects')} value={GlobalSearchResource.PROJECT} />
      <Tab label={t('Files')} value={GlobalSearchResource.FILE} />
      <Tab label={t('People')} value={GlobalSearchResource.USER} />
    </Tabs>
  );
};
