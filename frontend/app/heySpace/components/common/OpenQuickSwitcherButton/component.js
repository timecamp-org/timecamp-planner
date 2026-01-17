import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { doNothing } from 'common/utils';
import { Search } from 'commonComponents/Icons/fontawesome/Search';
import MenuButton from 'components/buttons/MenuButton';
import { SidebarActionButton } from 'components/buttons/SidebarActionButton';
import NavigationHistoryArrows from 'components/menu/NavigationHistoryArrows';
import { useTranslation } from 'i18n';
import { selectCurrentOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain';

import styles from './styles.css';

const NavigationHistoryArrowsWrapper = styled.div`
  margin-left: auto;
`;

OpenQuickSwitcherButton.propTypes = {
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

OpenQuickSwitcherButton.defaultProps = {
  onClick: doNothing,
  isCollapsed: false,
};

function OpenQuickSwitcherButton(props) {
  const { t } = useTranslation();
  const workspaceName = useSelector(selectCurrentOrganizationName);

  return props.isCollapsed ? (
    <SidebarActionButton isCollapsed onClick={props.onClick}>
      <Search />
    </SidebarActionButton>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span>{workspaceName}</span>
        <NavigationHistoryArrowsWrapper>
          <NavigationHistoryArrows />
        </NavigationHistoryArrowsWrapper>
      </div>
      <MenuButton onClick={props.onClick} className={styles.button}>
        {() => (
          <p className={styles.buttonCaption}>
            <Search className={styles.icon} />
            {t('Search for chat or task')}
          </p>
        )}
      </MenuButton>
    </div>
  );
}

export default OpenQuickSwitcherButton;
