import { KeyboardEventHandler, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import fuzzysearch from 'fuzzysearch';
import { List } from 'immutable';
import keycode from 'keycode';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import { UserTracker } from 'common/services';
import generateId from 'common/utils/generate-pushid';
import { generateConversationId } from 'common/utils/generateCombinedId';
import { Id } from 'common/utils/identifier';
import { makeConversationLink } from 'common/utils/routerHelpers';
import { i18n } from 'i18n';
import { onCloseModal as closeGlobalModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { UserToInvite } from 'models/domain/OrganizationsModel/types';

import { DataProviderHookInterface, useDataPersister, useDataProvider } from './dataHooks';

export interface TeamHeaderMenuHookInterface {
  isModalOpen: boolean;
  isInviting: boolean;
  isInvitingPeople: boolean;
  userIds: List<Id>;
  error: string;
  canCurrentUserInvitePeople: boolean;
  isInvitingGuests: boolean;
  isCurrentSubscriptionFree: boolean;
  isShowingDisabled: boolean;
  selectedUsers: List<Id>;
  tagsInputRef: RefObject<HTMLInputElement>;
  inputRef: RefObject<HTMLInputElement>;
  onOpenModal: (arg1: boolean) => void;
  onHideModal: VoidFunction;
  onAddUser: (arg1?: Id) => void;
  onRemoveUser: (arg: Id) => void;
  onCreateAndGoToConversation: VoidFunction;
  onInputKeyDown: KeyboardEventHandler;
  onChangeContent: VoidFunction;
  onInviteMembers: (arg: string[]) => void;
  onSetIsInvitingGuests: (arg: boolean) => void;
  onSelectedSpacesChange: (arg: List<string>) => void;
  onToggleShowDisabled: VoidFunction;
  onSetSearchRowRef: (arg1: HTMLDivElement, arg2: number) => void;
  userListFilter: (arg1: List<Id>, arg2: string) => void;
  isUserSelected: (arg1: number) => boolean;
}

const emptyList = List<string>();

export default function useComponent({ isInvitingPeople }: { isInvitingPeople: boolean }): TeamHeaderMenuHookInterface {
  const [isShowingDisabled, onSetIsShowingDisabled] = useState<boolean>(false);

  const {
    canCurrentUserInvitePeople,
    currentUserId,
    isCurrentSubscriptionFree,
    isInviting,
    organizationId,
    userSearchName,
    userIds,
  }: DataProviderHookInterface = useDataProvider(isShowingDisabled);

  const { onCreateConversationIfDoesNotExist, onInviteGuestsToOrganization, onInviteUsersToOrganization } =
    useDataPersister();

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useElementOpen(false);
  const [error, setError] = useState<string>(null);
  const [selectedUserIndex, onSetSelectedUserIndex] = useState<number>(null);
  const [selectedUsers, onSetSelectedUsers] = useState<List<Id>>(emptyList);
  const [selectedSpaceIds, onSetSelectedSpaceIds] = useState<List<Id>>(emptyList);
  const [isInvitingGuests, onSetIsInvitingGuestsState] = useState<boolean>(false);

  const history = useHistory();

  const searchResult = useRef<List<Id>>();
  const tagsInputRef = useRef<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement>();
  const searchRowRefs = useRef<HTMLDivElement[]>([]);
  const dispatch = useDispatch();

  const prevIsModalOpen = usePrevious(isModalOpen);
  const prevIsInviting = usePrevious(isInviting);

  // TODO: Update interface remove that function
  const onOpenModal = useCallback(
    (isInvitingPeopleNow: boolean): void => {
      onModalOpen();
      // onSetIsInvitingPeople(isInvitingPeopleNow)
    },
    [onModalOpen]
  );

  const onHideModal = useCallback((): void => {
    dispatch(closeGlobalModal(ModalType.INVITE_PEOPLE_MODAL));
    onModalClose();
    setError(null);
  }, [onModalClose, setError]);

  // TODO: Update interface remove that function
  const onChangeContent = useCallback((): void => {
    // onSetIsInvitingPeople(!isInvitingPeople)
  }, [isInvitingPeople]);

  const onToggleShowDisabled = useCallback(() => {
    UserTracker.track(UserTrackerEvent.filterUsed, {
      place: 'Team Invitation Modal',
      name: 'Show with disabled',
      value: !isShowingDisabled,
    });
    onSetIsShowingDisabled(!isShowingDisabled);
  }, [isShowingDisabled]);

  const setStateToInitial = useCallback(() => {
    onModalClose();
    setError(null);
    onSetSelectedUsers(emptyList);
    onSetSelectedUserIndex(null);
  }, [onModalClose]);

  const onGoToDirectSelfConversation = useCallback(() => {
    onCreateConversationIfDoesNotExist(List([currentUserId]));
    setImmediate(() => {
      const conversationId = generateConversationId([currentUserId], organizationId);
      history.push(makeConversationLink(conversationId));
    });
  }, [onCreateConversationIfDoesNotExist, currentUserId, organizationId, history]);

  const onGoToDirectOrGroupConversation = useCallback(() => {
    let selectedUsersWithPossibleCurrentUser = selectedUsers;

    if (!selectedUsers.includes(currentUserId)) {
      selectedUsersWithPossibleCurrentUser = selectedUsersWithPossibleCurrentUser.push(currentUserId);
    }

    const conversationId = generateConversationId(selectedUsersWithPossibleCurrentUser, organizationId);
    onCreateConversationIfDoesNotExist(selectedUsersWithPossibleCurrentUser);

    setImmediate(() => {
      history.push(makeConversationLink(conversationId));
    });
  }, [selectedUsers, currentUserId, organizationId, history, onCreateConversationIfDoesNotExist]);

  const onCreateAndGoToConversation = useCallback(() => {
    const selectedUsersWithoutCurrent = selectedUsers.filter((userId) => userId !== currentUserId);

    if (selectedUsersWithoutCurrent.isEmpty()) {
      onGoToDirectSelfConversation();
    } else {
      onGoToDirectOrGroupConversation();
    }

    setStateToInitial();
  }, [selectedUsers, setStateToInitial, currentUserId, onGoToDirectSelfConversation, onGoToDirectOrGroupConversation]);

  const getSearchRowRef = (index: number) => searchRowRefs.current[index];

  const onAddUser = useCallback(
    (userId?: Id) => {
      if (typeof userId === 'string' || (selectedUserIndex !== null && selectedUserIndex >= 0)) {
        const searchElement = getSearchRowRef(selectedUserIndex);
        const id = typeof userId === 'string' ? userId : searchElement.id;

        if (id && selectedUsers.indexOf(id) === -1) {
          onSetSelectedUsers(selectedUsers.push(id));
          onSetSelectedUserIndex(null);
          // @ts-ignore
          tagsInputRef.current?.clearInput();
        }

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [selectedUserIndex, selectedUsers]
  );

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      const { key } = event;

      if (key === 'Backspace' && value === '') {
        onSetSelectedUserIndex(null);
        onSetSelectedUsers(selectedUsers.pop());
      } else if (key === 'Enter') {
        if (value === '' && selectedUsers.size > 0 && selectedUserIndex === null) {
          onCreateAndGoToConversation();
        } else {
          onAddUser();
        }
      } else if (key !== 'ArrowDown' && key !== 'ArrowUp') {
        onSetSelectedUserIndex(searchResult.current && !searchResult.current.isEmpty() ? 0 : null);
      }
    },
    [selectedUsers, selectedUserIndex, onCreateAndGoToConversation, onAddUser]
  );

  const validateGuestForm = useCallback(() => {
    if (selectedSpaceIds.size === 0) {
      const errorText = i18n.t('You forgot to choose projects.');
      setError(errorText);

      return false;
    }
    return true;
  }, [selectedSpaceIds, setError]);

  const onClearErrors = useCallback(() => {
    setError(null);
  }, [setError]);

  const onInviteMembers = useCallback(
    (emails: string[]) => {
      onClearErrors();

      if (emails.length === 0) {
        return false;
      }
      const users: UserToInvite[] = emails.map((email) => {
        UserTracker.track(UserTrackerEvent.memberInvited, { source: 'team-menu' });

        return {
          userId: generateId(),
          email,
        };
      });

      if (isInvitingGuests) {
        const isValid = validateGuestForm();

        if (isValid) {
          onInviteGuestsToOrganization(emails, selectedSpaceIds.toJS());
          onSetSelectedSpaceIds(emptyList);

          return true;
        } else {
          return false;
        }
      } else {
        onInviteUsersToOrganization(users);

        return true;
      }
    },
    [
      onClearErrors,
      isInvitingGuests,
      validateGuestForm,
      onInviteGuestsToOrganization,
      selectedSpaceIds,
      onInviteUsersToOrganization,
    ]
  );

  const onRemoveUser = useCallback(
    (userId: Id) => {
      if (userId) {
        const index = selectedUsers.indexOf(userId);
        onSetSelectedUsers(selectedUsers.remove(index));
      }
    },
    [selectedUsers, onSetSelectedUsers]
  );

  const onKeyDown: EventListener = useCallback(
    (event: KeyboardEvent) => {
      let index: number = null;

      if (searchResult.current && !searchResult.current.isEmpty()) {
        if (
          event.keyCode === keycode('down') &&
          (searchResult.current.size > selectedUserIndex + 1 || !selectedUserIndex)
        ) {
          index = selectedUserIndex !== null ? selectedUserIndex + 1 : 0;
        } else if (event.keyCode === keycode('up') && (selectedUserIndex - 1 >= 0 || !selectedUserIndex)) {
          index = selectedUserIndex !== null ? selectedUserIndex - 1 : 0;
        }

        if (index !== null && index >= 0) {
          onSetSelectedUserIndex(index);
          event.preventDefault();

          if (searchRowRefs.current && searchRowRefs.current[index]) {
            searchRowRefs.current[index].scrollIntoView({ behavior: 'auto', block: 'nearest' });
          }
        }
      }
    },
    [searchRowRefs, searchResult, selectedUserIndex, onSetSelectedUserIndex]
  );

  const onSetSearchRowRef = useCallback(
    (ref: HTMLDivElement, index: number) => {
      searchRowRefs.current[index] = ref;
    },
    [searchRowRefs]
  );

  const isUserSelected = useCallback(
    (userIndex: number): boolean => selectedUserIndex === userIndex,
    [selectedUserIndex]
  );

  const onSetIsInvitingGuests = useCallback(
    (newIsInvitingGuests: boolean) => {
      onSetIsInvitingGuestsState(newIsInvitingGuests);
    },
    [onSetIsInvitingGuestsState]
  );

  const onSelectedSpacesChange = useCallback(
    (newSelectedSpaceIds: List<string>) => {
      onSetSelectedSpaceIds(newSelectedSpaceIds);
    },
    [onSetSelectedSpaceIds]
  );

  const createNameComparatorForPhrase = useCallback(
    (searchPhrase: string) => (userAId: string, userBId: string) => {
      const compareValueA: string = userSearchName.get(userAId) ? userSearchName.get(userAId).toLowerCase().trim() : '';
      const compareValueB: string = userSearchName.get(userBId) ? userSearchName.get(userBId).toLowerCase().trim() : '';
      let positionA: number = compareValueA.indexOf(searchPhrase);
      let positionB: number = compareValueB.indexOf(searchPhrase);
      if (positionA < 0) {
        positionA = Number.MAX_SAFE_INTEGER;
      }
      if (positionB < 0) {
        positionB = Number.MAX_SAFE_INTEGER;
      }
      return positionA === positionB ? 0 : positionA < positionB ? -1 : 1;
    },
    [userSearchName]
  );

  const userListFilter = useCallback(
    (userIdsToFilter: List<Id>, value: string) => {
      let result = emptyList;

      userIdsToFilter.forEach((userId) => {
        const name = userSearchName.get(userId) || '';

        if (fuzzysearch(value.toLowerCase(), name.toLowerCase())) {
          result = result.push(userId);
        }
      });

      const filteredResults = result.filter((id: Id) => selectedUsers.indexOf(id) === -1);

      searchResult.current = filteredResults as List<Id>;

      return result.sort(createNameComparatorForPhrase(value));
    },
    [createNameComparatorForPhrase, selectedUsers, userSearchName]
  );

  useEffect(() => {
    if (prevIsModalOpen && !isModalOpen) {
      document.removeEventListener('keydown', onKeyDown);
    }

    if (!prevIsModalOpen && isModalOpen) {
      document.addEventListener('keydown', onKeyDown);
    }

    if (prevIsInviting && !isInviting && isModalOpen) {
      onHideModal();
    }
  }, [isInviting, isModalOpen, onHideModal, onKeyDown, prevIsInviting, prevIsModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(
    () => () => {
      document.removeEventListener('keydown', onKeyDown);
    },
    []
  );

  return {
    isModalOpen,
    isInviting,
    isInvitingPeople: isInvitingPeople && canCurrentUserInvitePeople,
    userIds,
    error,
    canCurrentUserInvitePeople,
    isInvitingGuests,
    isCurrentSubscriptionFree,
    isShowingDisabled,
    selectedUsers,
    tagsInputRef,
    inputRef,
    onOpenModal,
    onHideModal,
    onAddUser,
    onRemoveUser,
    onCreateAndGoToConversation,
    onInputKeyDown,
    onChangeContent,
    onInviteMembers,
    onSetIsInvitingGuests,
    onSelectedSpacesChange,
    onToggleShowDisabled,
    onSetSearchRowRef,
    userListFilter,
    isUserSelected,
  };
}
