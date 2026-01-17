/* eslint-disable @typescript-eslint/naming-convention */
import { Components, Theme } from '@mui/material';

import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';

import { theme } from './app-theme';

export const muiComponentsStyles: Components<Omit<Theme, 'components'>> = {
  MuiButtonBase: {
    styleOverrides: {
      root: {
        fontSize: theme.fontSize.sm,
        padding: '.4rem',
        height: 'min-content',
      },
    },
    variants: [
      {
        props: { disabled: true },
        style: {
          opacity: '0.7',
        },
      },
    ],
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        padding: '.6rem 2rem',
        color: theme.color.white,
        boxShadow: 'none',
        minWidth: 'max-content',
        textTransform: 'unset',

        ':hover': {
          boxShadow: 'none',
        },
      },
    },
    variants: [
      {
        props: { variant: 'contained' },
        style: {
          color: theme.color.white,
          background: theme.color.primary[500],
          borderRadius: '999rem',
        },
      },
      {
        props: { variant: 'outlined' },
        style: {
          color: theme.color.primary[500],
          background: '',
          border: `.1rem solid ${theme.color.primary[500]}`,
          borderRadius: '999rem',
          fontWeight: theme.fontWeight.semibold,
        },
      },
      {
        props: { variant: 'text' },
        style: {
          color: theme.color.primary[500],
          background: '',
          border: 'none',
          borderRadius: '999rem',
        },
      },
      {
        props: { variant: 'underlined' },
        style: {
          color: theme.color.primary[900],
          fontWeight: theme.fontWeight.regular,
          background: '',
          boxShadow: 'none',
          borderRadius: 0,
          padding: '.6rem',
          textTransform: 'none',
          '&::after': {
            content: '""',
            width: '95%',
            borderBottom: `1px solid ${theme.color.gray[300]}`,
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
          },
          '&:focus-within::after': {
            borderColor: theme.color.primary[500],
          },
        },
      },
      {
        props: { variant: 'text-reversed' },
        style: {
          padding: '.6rem',
          border: 'none',
          fontWeight: theme.fontWeight.medium,
          color: theme.color.gray[900],
          backgroundColor: 'transparent',
          minWidth: '2rem',
          '&:hover': {
            color: theme.color.primary[500],
            backgroundColor: theme.color.gray[200],
          },
        },
      },
      {
        props: { disabled: true },
        style: {
          borderColor: 'transparent',
        },
      },
      {
        props: { color: 'error', variant: 'contained' },
        style: {
          background: theme.color.critical[500],
          '&:hover': {
            background: theme.color.critical[500],
          },
        },
      },
      {
        props: { size: 'xs' },
        style: {
          fontSize: theme.fontSize.xxs,
          fontWeight: theme.fontWeight.regular,
          maxHeight: '2.4rem',
          padding: '1rem',
        },
      },
      {
        props: { color: 'error', variant: 'text' },
        style: {
          color: theme.color.critical[500],
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        width: '3rem',
        height: '3rem',
        borderRadius: '8px',
        padding: '.8rem',
        '&:hover': {
          color: theme.color.primary[500],
        },
      },
    },
  },
  MuiDivider: {
    defaultProps: {
      variant: 'inset',
    },
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${theme.color.gray[200]}`,
        margin: '1.2rem .8rem',
        width: 'calc(100% - 2 * 1.2rem)',
      },
    },
    variants: [
      {
        props: { variant: 'fullWidth' },
        style: {
          margin: 'unset',
          marginTop: '-1px',
          padding: 'unset',
          width: '100%',
          boxSizing: 'border-box',
        },
      },
      {
        props: { variant: 'text' },
        style: {
          fontWeight: 'var(--fontWeight-medium)',
          color: 'var(--color-gray-500)',
          margin: '0 1.6rem',
          border: 'none',
          '&:after, &:before': {
            opacity: '0',
          },
        },
      },
    ],
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontSize: theme.fontSize.xs,
        padding: '.6rem 1rem',
        minWidth: 'unset',
        minHeight: 'unset',
        maxHeight: '2.8rem',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 'unset',
        height: 'min-content',
        marginLeft: '1.6rem',
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        fontSize: 'inherit',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: theme.fontSize.base,
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      IconComponent: ChevronDown,
      variant: 'standard',
    },
    styleOverrides: {
      select: {
        maxHeight: '1.5rem',
        width: '100%',
        padding: '0 .8rem',

        '&:focus, &::after': {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
      },
      icon: {
        paddingRight: '.8rem',
      },
      iconOpen: {
        paddingLeft: '.8rem',
        paddingRight: 0,
      },
    },

    variants: [
      {
        props: { variant: 'standard' },
        style: {},
      },
    ],
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        width: 'min-content',
        border: 'none',
        '&:before': {
          borderBottom: `1px solid ${theme.color.gray[300]}`,
        },
        '&:hover:before': {
          borderBottom: `2px solid ${theme.color.gray[400]} !important`,
        },
        '&.Mui-focused': {
          background: 'unset',
        },
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        padding: '.8rem',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        marginTop: '3px',
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        marginLeft: '-1rem',
      },
    },
  },
};
