import { FC } from 'react';

import styles from './styles.css';

interface UnderlinedInputWrapperInterface
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  onSetRef?: (element: HTMLDivElement) => void;
  isFocused?: boolean;
}

export const UnderlinedControlledInputWrapper: FC<UnderlinedInputWrapperInterface> = ({
  children,
  className,
  onSetRef,
  isFocused,
  onPasteCapture,
  tabIndex,
  ...props
}) => (
  <div
    ref={onSetRef}
    className={`${isFocused ? styles.wrapperFocused : styles.wrapper} ${className || ''}`}
    onPasteCapture={onPasteCapture}
    tabIndex={tabIndex}
    {...props}
  >
    {children}
  </div>
);
