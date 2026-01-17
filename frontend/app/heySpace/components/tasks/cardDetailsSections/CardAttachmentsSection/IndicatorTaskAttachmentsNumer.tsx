import { FC } from 'react';

import { useSelector } from 'react-redux';

import { selectTaskAttachmentsIds } from 'models/domain/TasksModel/selectors';

interface IndicatorTaskAttachmentsNumberInterface {
    taskId: string;
}

export const IndicatorTaskAttachmentsNumber: FC<IndicatorTaskAttachmentsNumberInterface> = ({ taskId }) => {
    const attachmentsNumber = useSelector((state) => selectTaskAttachmentsIds(state, { taskId })).size;

    return <span>({attachmentsNumber})</span>;
};
