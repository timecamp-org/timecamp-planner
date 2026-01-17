import { FC } from 'react';

import { Box, SxProps, Typography } from '@mui/material';

import { AppLogo } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

const boxStyles: SxProps = {
  display: 'flex',
  alignItems: 'center',
};

const typographyStyles: SxProps = {
  fontSize: 'var(--fontSize-lg)',
  fontWeight: 'var(--fontWeight-bold)',
  marginLeft: '.8rem',
  color: 'var(--color-gray-900)',
};

interface PlannerLogoInterface {
  className?: string;
  isCollapsed?: boolean;
}

export const PlannerLogo: FC<PlannerLogoInterface> = ({ className, isCollapsed }) => {
  const { t } = useTranslation();

  return (
    <Box sx={boxStyles} className={className}>
      <AppLogo />
      {!isCollapsed && (
        <Typography variant="h3" sx={typographyStyles}>
          {t('Planner')}
        </Typography>
      )}
    </Box>
  );
};
