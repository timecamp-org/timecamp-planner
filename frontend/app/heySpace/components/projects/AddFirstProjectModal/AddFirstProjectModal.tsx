import { UserTracker } from 'common/services';
import { i18mark } from 'i18n';
import { ModalType } from 'models/component/ModalsModel/types';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';

import AddProjectModal from '../AddProjectModal/AddProjectModal';

const HEADER = i18mark('Add First Project');

export const AddFirstProjectModal = () => {
  const onProjectCreate = () => {
    UserTracker.track(UserTrackerEvent.spaceCreated, { name: 'First project created' });
  };

  return (
    <AddProjectModal modalType={ModalType.ADD_FIRST_PROJECT_MODAL} header={HEADER} onProjectCreate={onProjectCreate} />
  );
};
