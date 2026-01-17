import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Search } from 'commonComponents/Icons/fontawesome/Search';
import UniversalModal from 'commonComponents/UniversalModal';
import MenuButton from 'components/buttons/MenuButton';
import AddSpaceController from 'components/menu/AddSpaceController';
import BrowseSpacesController from 'components/menu/BrowseSpacesController';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import styles from './styles.css';

SpaceListHeader.propTypes = {
  canCurrentUserCreateProject: PropTypes.bool,
  openModal: PropTypes.string,
  modalProjectName: PropTypes.string,

  onUpdateModalProjectName: PropTypes.func,
  onOpenBrowseSpacesModal: PropTypes.func,
  onOpenCreateSpaceModal: PropTypes.func,
  onCloseModal: PropTypes.func,
};

SpaceListHeader.defaultProps = {
  canCurrentUserCreateProject: false,
  openModal: null,
  modalProjectName: '',

  onUpdateModalProjectName: doNothing,
  onOpenBrowseSpacesModal: doNothing,
  onOpenCreateSpaceModal: doNothing,
  onCloseModal: doNothing,
};

function SpaceListHeader(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      {renderBrowseSpacesButton(props, t)}
      {renderModal(props, t)}
    </div>
  );
}

function renderBrowseSpacesButton(props, t) {
  return (
    <MenuButton
      className={styles.title}
      projectColor={colorStyles.whiteFourColor}
      onClick={props.onOpenBrowseSpacesModal}
      isSelected={props.openModal === 'browseSpacesModal'}
    >
      {() => (
        <div className={styles.header}>
          <Search />
          <p className={styles.headerText}> {t('Search for projects')}</p>
        </div>
      )}
    </MenuButton>
  );
}

function renderModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.openModal !== null}
      onBackdropClick={props.onCloseModal}
      onSetIsModalOpen={props.onCloseModal}
      shouldRenderFooter={false}
      header={t('SEARCH FOR A PROJECT')}
      modalBodyClassName={styles.modalBody}
    >
      {props.openModal === 'createSpaceModal' ? (
        <AddSpaceController
          initialProjectName={props.modalProjectName}
          onUpdateModalProjectName={props.onUpdateModalProjectName}
          onHideModal={props.onCloseModal}
        />
      ) : (
        <BrowseSpacesController
          initialProjectName={props.modalProjectName}
          onUpdateModalProjectName={props.onUpdateModalProjectName}
          onHideModal={props.onCloseModal}
        />
      )}
    </UniversalModal>
  );
}

export default SpaceListHeader;
