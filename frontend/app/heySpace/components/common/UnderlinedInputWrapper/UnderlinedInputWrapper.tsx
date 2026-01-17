import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

import styles from './styles.css';

type UnderlinedInputWrapperInterface = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children?: ReactNode;
};

export const UnderlinedInputWrapper: FC<UnderlinedInputWrapperInterface> = ({ children, className, ...rest }) => (
  <div className={`${styles.wrapper} ${className || ''}`} {...rest}>
    {children}
  </div>
);
