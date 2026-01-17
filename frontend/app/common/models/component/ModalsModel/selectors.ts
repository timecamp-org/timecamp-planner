import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import generateSelectorName from '../../../utils/generateSelectorName';
import { domain as ModalsDomain } from './constants';

export const modalsDomain = (state) => state.get(ModalsDomain);

export const selectModalsData = createSelector(modalsDomain, (domain) => domain.get('modalsData') as Map<string, any>);

export const selectDidUserCloseModalDomain = createSelector(modalsDomain, (domain) =>
  domain.get('didUserCloseModalUltimately')
);

// args: modalType
export const selectModal = createCachedSelector(
  selectModalsData,
  (_, args) => args.modalType,
  (modalsData, modalType) => modalsData.get(modalType)
)((_, args) => generateSelectorName(args, ['modalType']));

// args: modalType, property
export const selectModalProperty = createCachedSelector(
  selectModal,
  (_, args) => args.property,
  (modal, property) => modal && modal.get(property)
)((_, args) => generateSelectorName(args, ['modalType', 'property']));

// args: modalType
export const selectIsModalOpen = createCachedSelector(
  selectModal,
  (modal) => !!modal
)((_, args) => generateSelectorName(args, ['modalType']));

// args: modalType
export const selectDidUserCloseModalUltimately = createCachedSelector(
  selectDidUserCloseModalDomain,
  (_, args) => args.modalType,
  (didUserCloseModalDomain, modalType) => didUserCloseModalDomain.get(modalType, false)
)((_, args) => generateSelectorName(args, ['modalType']));
