import styled from 'styles/styled';
import { Box, SxProps } from '@mui/material';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { useDispatch } from 'react-redux';

const overwatchPlaceholderOuterStyles: SxProps = {
  width: '100%',
  flex: 1,
  height: '50%',
  padding: '2rem',
  display: 'flex',
};

const overwatchPlaceholderInnerStyles: SxProps = {
  border: '2px dashed var(--color-gray-400)',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.6,
  },
};

const TitleWrapper = styled.h3`
  font-size: var(--fontSize-lg);
`;

const SelectWrapper = styled.span`
  text-decoration: underline;
`;

const OverwatchPlaceholder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onClick = () => dispatch(onOpenModal(ModalType.MANAGE_OVERWATCH_MODAL));

  return (
    <Box sx={overwatchPlaceholderOuterStyles}>
      <Box sx={overwatchPlaceholderInnerStyles} onClick={onClick}>
        <div>
          <Plus size="2xl" />
        </div>
        <div>
          <TitleWrapper>{t('No projects added')}</TitleWrapper>
        </div>
        <Box>
          <SelectWrapper>{t('Select')}</SelectWrapper> <span> </span>
          <span> {t('your most important projects and manage them in all Overwatch')}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default OverwatchPlaceholder;
