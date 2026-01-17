import { ModalType } from 'models/component/ModalsModel/types';
import { Id } from './identifier';

const localStorageSeparator = '::';

export enum LocalStorageBaseKeyName {
  MESSAGE_READ = 'messageRead',
  MESSAGE_KEYPRESS = 'messageKeypress',
  PROJECT_LAST_OPENED_PANEL = 'projectLastOpenedPanel',
  PROJECT_LAST_SUB_PANEL = 'projectLastSubPanel',
  IS_RIGHT_PANEL_OPENED = 'isRightPanelOpened',
  DID_USER_CLOSE_MODAL_ULTIMATELY = 'didUserCloseModalUltimately',
}

function generateLocalStorageId(baseKeyName: string, params: string[]) {
  return `${baseKeyName}${localStorageSeparator}${params.join(
    localStorageSeparator
  )}`;
}

export function makeObjectReadId(objectId: Id, userId: Id): string {
  return generateLocalStorageId(LocalStorageBaseKeyName.MESSAGE_READ, [
    objectId,
    userId,
  ]);
}

export function makeObjectKeyPressId(objectId: Id, userId: Id): string {
  return generateLocalStorageId(LocalStorageBaseKeyName.MESSAGE_KEYPRESS, [
    objectId,
    userId,
  ]);
}

export function makeProjectLastOpenedPanelId(projectId: Id): string {
  return generateLocalStorageId(
    LocalStorageBaseKeyName.PROJECT_LAST_OPENED_PANEL,
    [projectId]
  );
}

export function makeProjectLastOpenedSubPanelId(projectId: Id): string {
  return generateLocalStorageId(
    LocalStorageBaseKeyName.PROJECT_LAST_SUB_PANEL,
    [projectId]
  );
}

export function makeIsRightPanelOpenedId(projectId: Id): string {
  return generateLocalStorageId(
    LocalStorageBaseKeyName.PROJECT_LAST_SUB_PANEL,
    [projectId]
  );
}

export function makeDidUserCloseModalUltimatelyId(
  modalType: ModalType,
  userId: Id
) {
  return generateLocalStorageId(
    LocalStorageBaseKeyName.DID_USER_CLOSE_MODAL_ULTIMATELY,
    [modalType, userId]
  );
}

export default generateLocalStorageId;
