import { FC } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import UniversalModal from 'commonComponents/UniversalModal';

import ABTestVisibilityWrapper from 'components/extensions/ABTestVisibilityWrapper';
import { AddProjectController } from 'components/menu/AddSpaceControllerNext/AddProjectController';
import { useProjectCreationController } from 'components/menu/AddSpaceControllerNext/hooks/useProjectCreationController';
import { ProjectCreationStep } from 'components/menu/AddSpaceControllerNext/hooks/useProjectCreationStep';
import { i18mark, useTranslation } from 'i18n';
import { TestGranulation, TestType } from 'models/component/ABTestsModel/types';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import { ProjectTemplateInterface } from '../../menu/AddSpaceControllerNext/types';

import { AddProjectModal as AddProjectModalLegacy } from '../AddProjectLegacy/AddProjectModal/AddProjectModal';

import styles from './styles.css';

const DEFAULT_HEADER = i18mark('CREATE NEW PROJECT');

interface AddProjectModalInterface {
  header?: string;
  modalType?: ModalType;
  onProjectCreate?: () => void;
  isOpen: boolean;
}

const errorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark('Project creation error. Try agin later'),
});

const AddProjectModal: FC<AddProjectModalInterface> = ({
  header = DEFAULT_HEADER,
  onProjectCreate,
  modalType = ModalType.ADD_NEW_PROJECT_MODAL,
  isOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const onClose = () => {
    dispatch(onCloseModal(modalType));
  };

  const onSuccess = ({ id }: ProjectTemplateInterface) => {
    onClose();
    onProjectCreate?.();
    history.push(`/projects/${id}/kanban`);
  };

  const hook = useProjectCreationController({
    onSuccess,
    onCancel: onClose,
    onError: () => {
      dispatch(
        PopUpAlertsModelActions.onAddAlert({
          humanMessage: errorMessage,
        }),
      );
      onClose();
    },
  });

  const isHeaderCollapsed = hook.step === ProjectCreationStep.TEMPLATE;

  return (
    <UniversalModal
      isModalOpen={isOpen}
      onBackdropClick={onClose}
      onSetIsModalOpen={onClose}
      header={t(isHeaderCollapsed ? null : header)}
      shouldRenderFooter={false}
      modalBodyClassName={styles.modalBody}
      headerClassName={getConditionalClass(styles.headerCollapsed, isHeaderCollapsed)}
      innerModalDialogClassName={styles.innerModalDialogClassName}
    >
      <AddProjectController hook={hook} />
    </UniversalModal>
  );
};

const GlobalAddProjectModal = ({
  header = DEFAULT_HEADER,
  onProjectCreate,
  modalType = ModalType.ADD_NEW_PROJECT_MODAL,
}: Omit<AddProjectModalInterface, 'isOpen'>) => {
  const isOpen = useSelector((state) => selectIsModalOpen(state, { modalType }));

  return (
    <ABTestVisibilityWrapper
      testType={TestType.TIMECAMP_ORGANIZATION}
      granulation={TestGranulation.ORGANIZATION}
      baseComponent={
        isOpen && <AddProjectModalLegacy header={header} modalType={modalType} onProjectCreate={onProjectCreate} />
      }
    >
      {isOpen && (
        <AddProjectModal isOpen={isOpen} header={header} modalType={modalType} onProjectCreate={onProjectCreate} />
      )}
    </ABTestVisibilityWrapper>
  );
};
export default GlobalAddProjectModal;
