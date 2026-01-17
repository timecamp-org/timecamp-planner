import { FC } from 'react';

import { Placement } from '@popperjs/core';

import { Id } from 'common/utils/identifier';

import CardListPicker from '../CardListPicker';
import CardSpacePicker from '../CardSpacePicker';

import styles from './styles.css';

const popperModifiers = {
  offset: {
    offset: `0, 20`,
  },
};

export type CardDetailsBreadcrumbsInterface = {
  taskId: Id;
  className?: string;
  itemClassName?: string;
  targetClassName?: string;
  separatorClassName?: string;
  popperPlacement?: Placement;
  showSpacePicker?: boolean;
};

const defaultProps: Partial<CardDetailsBreadcrumbsInterface> = {
  popperPlacement: 'bottom',
};

const CardDetailsBreadcrumbs: FC<CardDetailsBreadcrumbsInterface> = (props) => (
  <div className={props.className || styles.Component}>
    {props.showSpacePicker && (
      <CardSpacePicker taskId={props.taskId} popperModifiers={popperModifiers} itemClassName={styles.button} />
    )}

    <CardListPicker taskId={props.taskId} popperModifiers={popperModifiers} itemClassName={styles.button} />
  </div>
);
CardDetailsBreadcrumbs.defaultProps = defaultProps;

export default CardDetailsBreadcrumbs;
