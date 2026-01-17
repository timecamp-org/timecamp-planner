import { FC, ReactNode } from 'react';

import MultiInviteInput from 'commonComponents/MultiInviteInput';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';

import styles from './styles.css';

interface UnderlinedMultiInviteInputInterface {
  className?: string;
  submitButtonClassName?: string;
  inputClassName?: string;
  inputInnerClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  submitButtonLabel?: string;
  shouldRenderSubmitButton?: boolean;
  isDisabled?: boolean;
  isInvitingGuests?: boolean;
  error?: ReactNode;
  submitButton?: ReactNode;
  onSubmit?: (emails: string[]) => void;
  onChange?: (email: string) => void;
  onSelectedEmailsChange?: (emails: string[]) => void;
}

export const UnderlinedMultiInviteInput: FC<UnderlinedMultiInviteInputInterface> = ({
  wrapperClassName,
  error,
  ...multiInviteProps
}) => (
  <UnderlinedInputWrapper className={styles.wrapper || wrapperClassName}>
    <MultiInviteInput {...multiInviteProps} />
    {error}
  </UnderlinedInputWrapper>
);
