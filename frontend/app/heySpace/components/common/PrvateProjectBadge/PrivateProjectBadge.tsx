import { FC } from 'react';

import { useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { LockKeyhole } from 'commonComponents/Icons/fontawesome/LockKeyHole';
import { selectProjectIsPrivate } from 'models/domain/ProjectsModel/selectors';

interface PrivateProjectBadgeInterface {
    projectId: Id;
}

export const PrivateProjectBadge: FC<PrivateProjectBadgeInterface> = ({ projectId }) => {
    const isPrivate = useSelector((state) => selectProjectIsPrivate(state, { projectId }));

    return isPrivate && <LockKeyhole size="sm" color="var(--color-gray-700)" />;
};
