import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { MoreVertical } from 'commonComponents/Icons';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';
import useElementOpen from 'common/hooks/useElementOpen';
import PopoverContent from 'commonComponents/PopoverContent';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import UniversalModal from 'commonComponents/UniversalModal';

WorkspaceOptions.propTypes = {
  isOrganizationOwner: PropTypes.bool,
  hasActiveSubscription: PropTypes.bool,

  onArchiveWorkspace: PropTypes.func,
  onLeaveWorkspace: PropTypes.func,
};

WorkspaceOptions.defaultProps = {
  isOrganizationOwner: false,
  hasActiveSubscription: false,

  onArchiveWorkspace: doNothing,
  onLeaveWorkspace: doNothing,
};

function WorkspaceOptions(props) {
  const { t } = useTranslation();
  const {
    isOpen: isPopoverOpened,
    onClose: onClosePopover,
    onToggleOpen: onTogglePopover,
  } = useElementOpen(false);
  const {
    isOpen: isArchiveModalOpen,
    onOpen: onOpenArchiveModal,
    onClose: onCloseArchiveModal,
  } = useElementOpen(false);
  const {
    isOpen: isLeaveWorkspaceModalOpen,
    onOpen: onOpenLeaveWorkspaceModal,
    onClose: onCloseLeaveWorkspaceModal,
  } = useElementOpen(false);

  return (
    <>
      {renderPopover()}
      {renderArchiveModal()}
      {renderLeaveWorkspaceModal()}
    </>
  );

  function renderPopover() {
    return (
      <PopoverContent
        isVisible={isPopoverOpened}
        onClickOutside={onClosePopover}
      >
        <UniversalPopover
          isPopoverOpened={isPopoverOpened}
          targetComponent={
            <SecondaryButton onClick={onTogglePopover}>
              <MoreVertical />
            </SecondaryButton>
          }
          popperComponent={
            <div>
              {renderLeaveWorkspace()}
              {renderArchiveWorkspace()}
            </div>
          }
          popperPlacement={'left-start'}
          shouldRenderArrow={false}
          popperModifiers={{
            offset: {
              offset: `15, 5`,
            },
          }}
          popperContentWrapperClassName={styles.popoverContent}
        />
      </PopoverContent>
    );
  }

  function renderLeaveWorkspaceModal() {
    return (
      <UniversalModal
        innerModalDialogClassName={styles.modalDialog}
        isModalOpen={isLeaveWorkspaceModalOpen}
        saveButtonCaption={t('Leave Workspace')}
        header={t('Leave Workspace')}
        onModalSave={props.onLeaveWorkspace}
        onSetIsModalOpen={onCloseLeaveWorkspaceModal}
        shouldFocusOnOpen={true}
      >
        {t(`Are you sure you want to leave this Workspace?`)}
      </UniversalModal>
    );
  }

  function renderArchiveModal() {
    return (
      <UniversalModal
        isModalOpen={isArchiveModalOpen}
        innerModalDialogClassName={styles.modalDialog}
        saveButtonCaption={t('Archive')}
        header={t('Do you want to archive this Workspace?')}
        onSetIsModalOpen={onCloseArchiveModal}
        onModalSave={props.onArchiveWorkspace}
      >
        {t(
          'You can always reactivate your Workspace later and bring back all the data. Keep in mind that archiving workspace doesn’t cancel your subscription, it does however make archived workspace unavailable for current members.'
        )}
      </UniversalModal>
    );
  }

  function renderArchiveWorkspace() {
    const isDisabled =
      !props.isOrganizationOwner || props.hasActiveSubscription;
    const onClickArchive = () => {
      onOpenArchiveModal();
      onClosePopover();
    };

    return (
      <TooltipedDisabledElement
        isDisabled={isDisabled}
        message={getDisabledMessage()}
      >
        <SecondaryButton
          isDisabled={isDisabled}
          onClick={onClickArchive}
          className={styles.popoverButton}
        >
          {t('Archive')}
        </SecondaryButton>
      </TooltipedDisabledElement>
    );
  }

  function getDisabledMessage() {
    if (!props.isOrganizationOwner) {
      return t('Only workspace owner can archive this workspace');
    } else if (props.hasActiveSubscription) {
      return t(
        'Please cancel your subscription before archiving this Workspace. '
      );
    }
  }

  function renderLeaveWorkspace() {
    const isDisabled = props.isOrganizationOwner;
    const onClickLeaveWorkspace = () => {
      onOpenLeaveWorkspaceModal();
      onClosePopover();
    };

    return (
      <>
        <TooltipedDisabledElement
          isDisabled={isDisabled}
          message={t(`Organization owner cannot leave Workspace`)}
        >
          <SecondaryButton
            onClick={onClickLeaveWorkspace}
            isDisabled={isDisabled}
            className={styles.popoverButton}
          >
            {t('Leave Workspace')}
          </SecondaryButton>
        </TooltipedDisabledElement>
      </>
    );
  }
}

export default WorkspaceOptions;
