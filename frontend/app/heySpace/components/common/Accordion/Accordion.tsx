import { ReactNode, SyntheticEvent } from 'react';

import { Box, styled, SxProps } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';

type AccordionVariant = 'reversed';

export interface AccordionInterface extends Pick<AccordionProps, 'expanded'> {
  header: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  variant?: AccordionVariant;
  storageId?: string;
  onChange?: (isOpen: boolean) => void;
}

const accordionStyles: SxProps = {
  boxShadow: 0,
  fontWeight: 'fontWeightMedium',
  color: 'var(--color-gray-900)',
  minHeight: '3.2rem',
  ':first-of-type': {
    borderRadius: 'unset',
  },
  ':before': {
    display: 'none',
  },
};

const reversedSummary = `
  flex-direction: row;
  margin: 0;
  flex-grow: unset;
  justify-content: space-between;
  width: 100%;

  .MuiAccordionSummary-expandIconWrapper {
    margin-right: 0;
    margin-left: auto;
  }
`;

const StyledSummary = styled(MuiAccordionSummary)<{ variant?: AccordionVariant }>`
  flex-grow: 1;
  padding-left: ${({ variant }) => (variant === 'reversed' ? 0 : '2.5rem')};
  min-height: 3.2rem;
  flex-direction: row-reverse;

  .MuiAccordionSummary-expandIconWrapper {
    margin-right: 1.2rem;
  }

  ${({ variant }) => variant === 'reversed' && reversedSummary}
`;

const IconBox = styled(Box)`
  margin-right: 1.8rem;
  max-height: 3.2rem;
  display: flex;
  align-items: center;

  & > * {
    margin-left: 0.4rem;
  }
`;

const detailsStyles: SxProps = {
  padding: '0',
  paddingLeft: '1.5rem',
};

const ButtonWrapper = styled(Box)<{ variant?: AccordionVariant }>`
  display: flex;
  align-items: center;
  ${({ variant }) => variant === 'reversed' && 'flex-direction: row-reverse;'}
`;

export const Accordion: ReactFCWithChildren<AccordionInterface> = ({
  expanded = false,
  children,
  rightIcon,
  header,
  className,
  variant,
  storageId,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useLocalStorage(storageId, expanded);

  // eslint-disable-next-line no-shadow
  const onToggleIsOpen = (event: SyntheticEvent<Element, Event>, expanded: boolean) => {
    setIsOpen(expanded);
    onChange?.(expanded);
  };

  return (
    <MuiAccordion
      elevation={0}
      sx={accordionStyles}
      expanded={storageId ? isOpen : expanded}
      onChange={onToggleIsOpen}
      disableGutters
      className={className}
    >
      <ButtonWrapper variant={variant}>
        <StyledSummary variant={variant} expandIcon={<ChevronDown size="lg" color="var(--color-gray-500)" />}>
          {header}
        </StyledSummary>
        {rightIcon && <IconBox>{rightIcon}</IconBox>}
      </ButtonWrapper>
      <MuiAccordionDetails sx={detailsStyles}>{children}</MuiAccordionDetails>
    </MuiAccordion>
  );
};
