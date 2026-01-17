import { useDispatch } from 'react-redux';
import styled from 'styles/styled';
import { Button, SxProps } from '@mui/material';
import { useTranslation } from 'i18n';
import NoProjectsPlaceholder from 'styles/assets/project-placeholder.png';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { useSelector } from 'common/hooks/useSelector';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectIsUserOrganizationOwner } from 'models/domain/OrganizationsModel/selectors/domain';

const PageWrapper = styled.div`
  background: var(--color-gray-50);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  transform: translateX(-25%);
`;

const buttonStyles: SxProps = {
  background: 'var(--color-primary-500)',
  color: 'var(--color-white)',
  borderRadius: '2px',
  '&:hover': {
    background: 'var(--color-primary-500)',
    color: 'var(--color-white)',
  },
};

const NoProjectsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = useSelector(selectCurrentUserId);

  const isOwner = useSelector((state) => selectIsUserOrganizationOwner(state, { userId }));
  const onClick = () =>
    dispatch(onOpenModal(isOwner ? ModalType.ADD_NEW_PROJECT_MODAL : ModalType.BROWSER_SPACES_MODAL));

  return (
    <PageWrapper>
      <InnerWrapper>
        <img src={NoProjectsPlaceholder}></img>
        <h2>{t('No projects')}</h2>
        <div>
          <span>
            {isOwner
              ? t('Create project to start working in Planner app')
              : t('Join to active projects to start working in Planner app')}
            !
          </span>
        </div>
        <Button sx={buttonStyles} variant="outlined" onClick={onClick}>
          {isOwner ? t('Create project') : t('Search projects')}
        </Button>
      </InnerWrapper>
    </PageWrapper>
  );
};
export default NoProjectsPage;
