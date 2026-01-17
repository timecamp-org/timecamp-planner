import styles from './styles.css';

import { Button } from '@mui/material';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TagsInput from 'react-tagsinput';

import { Id } from 'common/utils/identifier';
import Checkbox from 'commonComponents/Checkbox';
import { Delete } from 'commonComponents/Icons';
import ListSearch from 'commonComponents/ListSearch';
import LoadingDots from 'commonComponents/LoadingDots';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import { UnderlinedMultiInviteInput } from 'commonComponents/UnderlinedMultiInviteInput';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import {
  selectIsUserOrganizationAdmin,
  selectIsUserOrganizationOwner,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { CircleQuestion } from '../../../common/Icons/fontawesome/CircleQuestion';
import PersonFullName from '../../../person/PersonFullName';
import PersonFullNameAndEmail from '../../../person/PersonFullNameAndEmail';
import PersonIcon from '../../../person/PersonIcon';
import SpacePicker from '../../../projects/SpacePicker';
import EmptyTaskListPlaceholder from '../../../taskList/EmptyTaskListPlaceholder';

import useComponent from './hook';

const avatarSize = 30;

interface TeamMenuModalInterface {
  isInvitingPeople?: boolean;
}

// TODO Split it into two independent modals
const TeamMenuModal: ReactFCWithChildren<TeamMenuModalInterface> = ({ children, isInvitingPeople }) => {
  const { t } = useTranslation();
  const isInviteModalOpen = useSelector((state) =>
    selectIsModalOpen(state, { modalType: ModalType.INVITE_PEOPLE_MODAL }),
  );

  const {
    error,
    isCurrentSubscriptionFree,
    isInvitingGuests,
    isModalOpen,
    isShowingDisabled,
    inputRef,
    selectedUsers,
    tagsInputRef,
    userIds,
    isInviting,
    isUserSelected,
    onAddUser,
    onCreateAndGoToConversation,
    onHideModal,
    onInputKeyDown,
    onInviteMembers,
    onOpenModal,
    onRemoveUser,
    onSelectedSpacesChange,
    onSetIsInvitingGuests,
    onSetSearchRowRef,
    onToggleShowDisabled,
    userListFilter,
  } = useComponent({ isInvitingPeople });

  return (
    <div className={styles.Component}>
      {renderTeamButton()}
      {renderModal()}
    </div>
  );

  function renderTeamButton() {
    const onClick = () => onOpenModal(false);

    return <div onClick={onClick}>{children}</div>;
  }

  function renderModal() {
    return (
      <UniversalModal
        innerModalDialogClassName={styles.modalDialog}
        modalBodyClassName={styles.modalBody}
        isModalOpen={isModalOpen || isInviteModalOpen}
        onBackdropClick={onHideModal}
        onSetIsModalOpen={onHideModal}
        header={renderHeader()}
        shouldRenderFooter={!isModalOpen}
        headerClassName={styles.modalHeader}
        footer={<Footer />}
      >
        {isModalOpen && renderListSearch()}
        {!isInvitingPeople && isInviteModalOpen && renderInvitePeople()}
      </UniversalModal>
    );
  }

  function renderHeader() {
    return (
      <div className={styles.header}>
        {!isInvitingPeople && isInviteModalOpen ? (
          <>
            {t('INVITE PEOPLE')}
            <p className={styles.subtitle}>{t('Invite others to your workspace and start working together.')}</p>
          </>
        ) : (
          t('OPEN A CHAT OR GO TO A GROUP CHAT')
        )}
      </div>
    );
  }

  function renderListSearch() {
    return (
      <div className={styles.modalBody}>
        <ListSearch
          list={userIds}
          excludedList={selectedUsers}
          inputRenderer={inputRenderer}
          rowRenderer={searchRowRenderer}
          emptyListRenderer={emptyListRenderer}
          listFilter={userListFilter}
          classNameInput={styles.input}
          classNameInputWrapper={styles.inputWrapper}
          className={styles.listSearch}
          classNameHeader={styles.listSearchHeader}
          classNameList={styles.listSearchList}
        />
      </div>
    );
  }

  function emptyListRenderer() {
    return (
      <EmptyTaskListPlaceholder
        className={styles.emptyListPlaceholder}
        title={t('Hmm… no one matches your search.')}
        subTitle={''}
      />
    );
  }

  function renderInvitePeople() {
    return (
      <div className={styles.inviteModalBody}>
        <UnderlinedMultiInviteInput
          onSubmit={onInviteMembers}
          isDisabled={isInviting}
          isInvitingGuests={isInvitingGuests}
          error={renderInviteError()}
        />
        <div className={styles.guestBar}>
          {renderGuestCheckbox()}
          {isInvitingGuests && (
            <SpacePicker className={styles.spacePicker} onSelectedSpacesChange={onSelectedSpacesChange} />
          )}
        </div>
        {isInviting && renderLoadingDots()}
      </div>
    );
  }

  function renderInviteError() {
    return <div className={styles.inviteError}>{error}</div>;
  }

  function inputRenderer({ onChange, value }: { onChange: InputEvent; value: string }) {
    return (
      <div className={styles.inputWrapper}>
        <TagsInput
          ref={tagsInputRef}
          className={styles.input}
          value={selectedUsers}
          inputValue={value}
          onlyUnique={true}
          onChangeInput={onChange}
          onChange={onAddUser}
          renderTag={selectedUserRenderer}
          inputProps={{
            ref: inputRef,
            placeholder: t('Find member'),
            onKeyDown: onInputKeyDown,
            autoFocus: true,
          }}
        />
        {renderGoButton()}
        {renderToggleDisabledCheckbox()}
      </div>
    );
  }

  function renderToggleDisabledCheckbox() {
    return (
      <div className={styles.toggleDisabledWrapper} onClick={onToggleShowDisabled}>
        <Checkbox isChecked={isShowingDisabled} onToggleStatus={onToggleShowDisabled} />
        <span className={styles.toggleDisabledText}>{t('Show inactive users')}</span>
      </div>
    );
  }

  function renderGoButton() {
    return (
      <Button
        size="xs"
        onClick={onCreateAndGoToConversation}
        disabled={selectedUsers.size === 0}
        className={styles.goButton}
      >
        {t('Go to chat')}
      </Button>
    );
  }

  function renderGuestCheckbox() {
    return (
      <div className={styles.guestCheckbox} onClick={() => onSetIsInvitingGuests(!isInvitingGuests)}>
        <TooltipedDisabledElement
          isDisabled={isCurrentSubscriptionFree}
          message={t('Adding guests is available only in the Premium plan.')}
        >
          <Checkbox isChecked={isInvitingGuests} isDisabled={isCurrentSubscriptionFree} />
        </TooltipedDisabledElement>
        {t('Invite as a guest')}
        <CircleQuestion />
      </div>
    );
  }

  function selectedUserRenderer({ tag }: { tag: Id }) {
    return (
      <div
        key={`MembersRightPanelChatSearchRow_selectedUserRenderer${tag}`}
        className={styles.selectedUserTag}
        onClick={() => onRemoveUser(tag)}
      >
        <PersonIcon
          userId={tag}
          wrapperClassName={styles.searchRowPersonIcon}
          showOnlineIndicator={false}
          width={avatarSize}
          height={avatarSize}
        />
        <PersonFullName userId={tag} className={styles.searchRowPersonFirstItem} />
        <Delete className={styles.deleteIcon} />
      </div>
    );
  }

  function searchRowRenderer({ item, index }: { item: Id; index: number }) {
    return (
      <div
        ref={(ref) => onSetSearchRowRef(ref, index)}
        id={item}
        key={`MembersRightPanelChatSearchRow_${item}`}
        className={`${styles.searchRow} ${isUserSelected(index) ? styles.selectedUser : undefined}`}
        onClick={() => onAddUser(item)}
      >
        <PersonIcon
          userId={item}
          wrapperClassName={styles.searchRowPersonIcon}
          showOnlineIndicator={false}
          width={avatarSize}
          height={avatarSize}
        />
        <PersonFullNameAndEmail
          userId={item}
          firstItemClassName={styles.searchRowPersonFirstItem}
          secondItemClassName={styles.searchRowPersonSecondItem}
        />
      </div>
    );
  }

  function Footer() {
    const userId = useSelector(selectCurrentUserId);
    const isOrganizationOwner = useSelector((state) => selectIsUserOrganizationOwner(state, { userId }));
    const isAdmin = useSelector((state) => selectIsUserOrganizationAdmin(state, { userId }));

    const isSettingsLinkVisible = isOrganizationOwner || isAdmin;

    return (
      <footer className={styles.footer}>
        {isSettingsLinkVisible && (
          <Link to="/settings/workspace" className={styles.settingsLink} onClick={onHideModal}>
            <Button variant="text">{t('See all invitees')}</Button>
          </Link>
        )}
        <Button onClick={onHideModal} variant="contained" className={styles.closeButton}>
          {t('Close')}
        </Button>
      </footer>
    );
  }

  function renderLoadingDots() {
    return (
      <div className={styles.loaderWrapper}>
        <LoadingDots className={styles.loadingDots} />
      </div>
    );
  }
};

export default TeamMenuModal;
