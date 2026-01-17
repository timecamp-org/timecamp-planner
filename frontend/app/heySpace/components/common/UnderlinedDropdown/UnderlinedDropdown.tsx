import { FC, useRef } from 'react';

import { Button } from '@mui/material';
import styled from 'styles/styled';
import Dotdotdot from 'react-dotdotdot';

import useElementOpen from 'common/hooks/useElementOpen';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import UniversalPopover from 'commonComponents/UniversalPopover';
import useOnClickOutside from 'hooks/useOnClickOutside';

import styles from './styles.css';
import { UnderlinedDropdownInterface } from './types';
import UnderlinedDropdownItems from './UnderlinedDropdownItems';

const TargetButton = styled(Button)<{ $isOpen: boolean }>`
  color: var(${({ $isOpen }) => ($isOpen ? '--color-primary-500' : '--color-gray-900')});
  display: flex;
  align-content: center;
  padding: 1rem;
  padding-left: 0;
  padding-bottom: 0.3rem;

  font-weight: var(--fontWeight-regular);
  position: relative;
  text-transform: unset;
  border-radius: unset;

  &:hover {
    color: var(--color-primary-500);
    background: transparent;
    &:after {
      background-color: var(--color-primary-500);
    }
  }

  &:active {
    color: var(--color-primary-500) !important;
    background: transparent;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 1rem;
    background-color: ${({ $isOpen }) => ($isOpen ? 'var(--color-primary-500)' : 'var(--color-gray-200)')};
    height: 0.1rem;
  }
`;

const UnderlinedDropdown: FC<UnderlinedDropdownInterface> = (props) => {
  const { label, isDisabled = false } = props;
  const targetRef = useRef<HTMLButtonElement>();

  const { isOpen, onToggleOpen, onClose } = useElementOpen(false);

  useOnClickOutside(targetRef, onClose);

  return (
    <>
      <UniversalPopover
        isPopoverOpened={isOpen}
        targetComponent={
          <TargetButton
            $isOpen={isOpen}
            disabled={isDisabled}
            disableRipple
            onClickCapture={(e) => {
              onToggleOpen();
            }}
            variant="text"
            ref={targetRef}
          >
            <Dotdotdot clamp={1} useNativeClamp={true}>
              <>{label}</>
              {isOpen ? (
                <ChevronUp className={styles.dropdownButtonIcon} />
              ) : (
                <ChevronDown className={styles.dropdownButtonIcon} />
              )}
            </Dotdotdot>
          </TargetButton>
        }
        popperContentWrapperClassName={styles.dropdownContent}
        popperComponent={<UnderlinedDropdownItems {...props} onClose={onClose} />}
        popperPlacement={'bottom'}
        shouldRenderArrow={false}
        popperModifiers={{
          offset: {
            offset: `-20, 5`,
          },
        }}
      />
    </>
  );
};

export default UnderlinedDropdown;
