import styled from 'styles/styled';
import { ButtonBase, Button as MuiButton, Switch as MuiSwitch, Tab as MuiTab, Tabs as MuiTabs } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

import { Spinner } from 'commonComponents/Spinner';

export const TimeCampColor = '#4BB063';

export const Switch = muiStyled(MuiSwitch)(({ theme }) => ({
  width: '4rem',
  height: '2rem',
  padding: 0,
  display: 'flex',
  borderRadius: '99rem',
  marginLeft: 0,

  '&:active': {
    '& .MuiSwitch-thumb': {
      width: '2rem',
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(100%)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(100%)',
      color: theme.color.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: TimeCampColor,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: '1.6rem',
    height: '1.6rem',
    borderRadius: '50%',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.color.gray[300],
    boxSizing: 'border-box',
  },
}));

export const Button = muiStyled(MuiButton)(() => ({
  backgroundColor: TimeCampColor,
  height: '3.2rem',
  marginLeft: 'auto',

  '&:hover': {
    backgroundColor: TimeCampColor,
    opacity: 0.9,
  },

  '&>svg:not(:first-child)': {
    marginLeft: '.8rem',
  },
}));

export const Tab = muiStyled(MuiTab)(() => ({
  '&.MuiTab-root.Mui-selected': {
    color: TimeCampColor,
  },
}));

export const Tabs = muiStyled(MuiTabs)(() => ({
  marginLeft: 0,
  '& .MuiTabs-indicator': {
    backgroundColor: TimeCampColor,
  },
}));

export const Line = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.5rem;
  width: 32rem;
  gap: 1.6rem;
`;

export const StartStopIconWrapper = styled.div`
  color: var(--color-white);
  transform: rotate(90deg);
  width: 1.2rem;
`;

export const Link = styled.a`
  text-decoration: underline;

  & > * {
    margin-right: 0.8rem;
  }
`;

export const Header = styled.div`
  font-weight: var(--fontWeight-semibold);
  background-color: var(--color-gray-100);
  padding: 1.8rem 2.4rem 1.6rem;
`;

export const TimeButton = styled(ButtonBase)<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? TimeCampColor : 'var(--color-gray-900)')};
  border: none;
  font-size: var(--fontSize-xss);
  display: flex;
  justify-content: center;
  gap: 0.8rem;
`;

export const StyledInput = styled.input`
  height: 3.2rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 99rem;
  text-align: end;
  padding-right: 1.6rem;
  min-width: 0;
  flex-grow: 1;
`;

export const TaskTimerBox = styled.span`
  display: inline-block;
  text-align: left;
  font-size: var(--fontSize-xs);
  width: 6rem;
  font-weight: var(--fontWeight-regular);
`;

export const FormError = styled.p`
  position: absolute;
  top: 100%;
  color: var(--color-critical-500);
  font-size: var(--fontSize-xxs);
`;

export const SpinnerGreen = styled(Spinner)`
  border-color: ${TimeCampColor} !important;
`;
