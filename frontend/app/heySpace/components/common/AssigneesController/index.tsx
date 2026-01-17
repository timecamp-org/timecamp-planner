import { FC, useEffect } from 'react';

import useElementOpen from 'common/hooks/useElementOpen';

import { AssigneesControllerInterface, AssigneesControllerView, defaultProps } from './AssignieControllerView';
import { useDataHooksFactory } from './hooks/dataHooks';
import { useComponent } from './hooks/hook';

const AssigneesController: FC<Omit<AssigneesControllerInterface, 'hook'>> = (props) => {
  const { isOpen, onOpen, onClose } = useElementOpen();

  const { objectType, objectId } = props;
  const { useDataPersister, useDataProvider } = useDataHooksFactory(objectType);
  const dataPersister = useDataPersister(objectId);
  const dataProvider = useDataProvider(objectId);
  const hook = useComponent({
    ...props,
    dataPersister,
    dataProvider,
    isAssigneesPickerOpen: isOpen,
    onSetIsPickerOpen: (isPickerOpen: boolean) => (isPickerOpen ? onOpen() : onClose()),
  });

  useEffect(() => {
    props.onSetIsPopoverOpen(isOpen);
  }, [isOpen]);

  return <AssigneesControllerView {...props} hook={hook} />;
};

AssigneesController.defaultProps = defaultProps;
export default AssigneesController;
