import React, { FC, MouseEventHandler } from 'react';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { BarsFilter } from 'commonComponents/Icons/fontawesome/BarsFilter';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';

import { BadgeNotificationType } from '../../../common/Badge/types';

import useComponent, { FiltersButtonWithCounterHookInterface } from './hook';
import styles from './styles.css';

export type FiltersButtonWithCounterInterface = {
  containerType: TaskFiltersContainerType;
  targetType: TaskFiltersTargetType;
  containerId: Id;
  className?: string;
  filterId?: Id;
  buttonClassName?: string;
  isActive?: boolean;
  onClick?: MouseEventHandler;
  targetRenderer?: () => JSX.Element;
};

const defaultProps = {
  onClick: doNothing,
};

const FiltersButtonWithCounter: FC<FiltersButtonWithCounterInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <div className={props.className || styles.Component}>
      {props.targetRenderer ? props.targetRenderer() : renderButton(props, hook)}
      <Badge
        objectType={BadgeNotificationType.STANDALONE}
        counter={hook.numberOfActiveFilters}
        className={styles.badge}
        color={hook.color}
      />
    </div>
  );
};

function renderButton(props: FiltersButtonWithCounterInterface, hook: FiltersButtonWithCounterHookInterface) {
  return (
    <SecondaryButton
      color={hook.color}
      className={props.buttonClassName || styles.icon}
      shouldFillContentWithColor={props.isActive}
      onClick={props.onClick}
    >
      <BarsFilter color={props.isActive ? 'var(--color-primary-500)' : 'var(--color-black)'} />
    </SecondaryButton>
  );
}

FiltersButtonWithCounter.defaultProps = defaultProps;

export default FiltersButtonWithCounter;
