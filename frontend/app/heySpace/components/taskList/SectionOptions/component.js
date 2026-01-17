import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { MoreVertical } from 'commonComponents/Icons';
import UniversalModal from 'commonComponents/UniversalModal';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SectionOptionsDropdown from 'components/taskList/SectionOptionsDropdown';
import { useTranslation } from 'i18n';

import styles from './styles.css';

SectionOptions.propTypes = {
  sectionId: PropTypes.string.isRequired,
  className: PropTypes.string,
  isDropdownVisible: PropTypes.bool,
  isArchiveListModalOpen: PropTypes.bool,
  onSetIsDropdownVisible: PropTypes.func,
  onSectionMove: PropTypes.func,
  onCloseArchiveListModal: PropTypes.func,
  onShowArchiveListModal: PropTypes.func,
  onArchiveList: PropTypes.func,
};

SectionOptions.defaultProps = {
  isDropdownVisible: false,
  isArchiveListModalOpen: false,
  onSetIsDropdownVisible: doNothing,
  onSectionMove: doNothing,
  onCloseArchiveListModal: doNothing,
  onShowArchiveListModal: doNothing,
  onArchiveList: doNothing,
};

function SectionOptions(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      {props.isDropdownVisible ? renderPopover() : renderMoreButton()}

      {
        <UniversalModal
          className={styles.modal}
          innerModalDialogClassName={styles.modalDialog}
          isModalOpen={props.isArchiveListModalOpen}
          header={t('ARCHIVE LIST')}
          saveButtonCaption={t('Archive')}
          onBackdropClick={props.onCloseArchiveListModal}
          onSetIsModalOpen={props.onCloseArchiveListModal}
          onModalSave={props.onArchiveList}
          color={props.color}
          shouldFocusOnOpen={true}
          shouldSaveOnEnter={true}
        >
          <div className={styles.confirmationDialogBody}>
            {t(`Are you sure you want to archive this list?`)}
          </div>
        </UniversalModal>
      }
    </div>
  );

  function renderPopover() {
    return (
      <UniversalPopover
        isPopoverOpened={props.isDropdownVisible}
        targetComponent={renderMoreButton()}
        popperComponent={renderDropdown()}
        popperPlacement={'bottom'}
        popperContentWrapperClassName={styles.popperContent}
        popperModifiers={{
          offset: {
            offset: `0, 10`,
          },
        }}
      />
    );
  }

  function renderMoreButton() {
    return (
      <div
        className={styles.moreVerticalWrapper}
        onClick={() => props.onSetIsDropdownVisible(true)}
      >
        <MoreVertical className={styles.moreVertical} />
      </div>
    );
  }

  function renderDropdown() {
    return (
      <>
        <div className={styles.dropdown}>
          <SectionOptionsDropdown
            sectionId={props.sectionId}
            userId={props.userId}
            sectionOptions={props.sectionOptions}
            onSetIsDropdownVisible={props.onSetIsDropdownVisible}
            onAddCard={props.onAddCard}
            onCopySectionDispatched={props.onCopySectionDispatched}
            onCopySectionCancelled={props.onCopySectionCancelled}
            onMoveSectionDispatched={props.onMoveSectionDispatched}
            onMoveSectionCancelled={props.onMoveSectionCancelled}
            onCardLimitCancelled={props.onCardLimitCancelled}
            onMoveAllCardsDispatched={props.onMoveAllCardsDispatched}
            onMoveAllCardsCancelled={props.onMoveAllCardsCancelled}
            onClickArchiveList={props.onShowArchiveListModal}
          />
        </div>
      </>
    );
  }
}

export default SectionOptions;
