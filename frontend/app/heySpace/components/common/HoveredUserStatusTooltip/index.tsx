import React, { MouseEventHandler, ReactNode } from 'react';

import { Placement } from '@popperjs/core';
import isToday from 'date-fns/is_today';

import { ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import Emoji from 'commonComponents/Emoji';
import InfoTooltip from 'commonComponents/InfoTooltip';
import UserName from 'commonComponents/UserName';
import useOnHover from 'hooks/useOnHover';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import DateOutput from '../../date/DateOutput';
import TimeOutput from '../../time/TimeOutput';

import useComponent, { HoveredUserStatusTooltipHookInterface } from './hook';
import styles from './styles.css';

const MAX_TITLE_SIZE = 200;

export type HoveredUserStatusTooltipInterface = {
  userId: Id;
  popperPlacement?: Placement;
  offset?: string;
  size?: number;
  showUserName?: boolean;
};

const defaultProps: Partial<HoveredUserStatusTooltipInterface> = {
  popperPlacement: 'bottom-end',
  offset: `0, 15`,
  size: 14,
};

const HoveredUserStatusTooltip: ReactFCWithChildren<HoveredUserStatusTooltipInterface> = (props) => {
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover<HTMLDivElement>(false);
  const hook = useComponent(props.userId);
  const { t } = useTranslation();
  const isPopoverOpened = Boolean(isHovering && (hook.emojiCode || hook.title.trim() || props.showUserName));

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={isPopoverOpened}
      infoTooltipWrapperClassName={styles.infoTooltip}
      popperPlacement={props.popperPlacement}
      targetComponent={renderTarget(props.children, onMouseEnter, onMouseLeave)}
      // @ts-ignore
      popperModifiers={getPopperModifiers(props)}
      message={renderUserStatus(props, hook, t)}
    />
  );
};

function renderTarget(
  children: ReactNode,
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}

function renderUserStatus(
  props: HoveredUserStatusTooltipInterface,
  hook: HoveredUserStatusTooltipHookInterface,
  t: TranslateFunction,
) {
  return (
    <div className={styles.userStatus}>
      {props.showUserName && <UserName userId={props.userId} />}
      <span className={styles.title}>
        {hook.emojiCode && (
          <span className={hook.title ? styles.emoji : styles.singleEmoji}>
            <Emoji colonsEmojiCode={hook.emojiCode} size={props.size} />
          </span>
        )}
        {ellipsizeInTheEnd(hook.title, MAX_TITLE_SIZE)}
      </span>
      {hook.resetAt && renderBottom(hook, t)}
    </div>
  );
}

function renderBottom(hook: HoveredUserStatusTooltipHookInterface, t: TranslateFunction) {
  return (
    <div className={styles.bottom}>
      {t<string>('until')}
      {isToday(hook.resetAt) ? (
        <TimeOutput
          // @ts-ignore
          timestamp={hook.resetAt}
          className={styles.resetAt}
        />
      ) : (
        <DateOutput timestamp={hook.resetAt} className={styles.resetAt} />
      )}
    </div>
  );
}

function getPopperModifiers(props) {
  return {
    offset: {
      offset: props.offset,
    },
    preventOverflow: {
      boundariesElement: 'window',
    },
  };
}

HoveredUserStatusTooltip.defaultProps = defaultProps;

export default HoveredUserStatusTooltip;
