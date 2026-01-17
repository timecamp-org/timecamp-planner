import { FC } from 'react';

import { Button } from '@mui/material';

import { Id } from 'common/utils/identifier';
import { useTranslation } from 'i18n';

import useComponent from './hook';

export type GoToTodayButtonInterface = {
  viewId: Id;
  className?: string;
};
const GoToTodayButton: FC<GoToTodayButtonInterface> = (props) => {
  const { t } = useTranslation();
  const { onClick } = useComponent(props.viewId);

  return (
    <Button variant="text" className={props.className} onClick={onClick}>
      {t('Today')}
    </Button>
  );
};

export default GoToTodayButton;
