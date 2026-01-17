import { Box, styled } from '@mui/material';
import { wisteriaColor } from 'common/commonStyles/colors';
import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { BaseProjectIcon } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import { selectProjectColor, selectProjectIconType } from 'models/domain/ProjectsModel/selectors';
import { FC } from 'react';

interface CircleProjectIconInterface {
  projectId: Id;
}

const ProjectWrapper = styled(Box)<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CircleProjectIcon: FC<CircleProjectIconInterface> = ({ projectId }) => {
  const color = useSelector((state) => selectProjectColor(state, { projectId })) || wisteriaColor;
  const iconType = useSelector((state) => selectProjectIconType(state, { projectId }));

  return (
    <ProjectWrapper color={color}>
      <BaseProjectIcon iconType={iconType} color={'var(--color-white)'} size="lg" />
    </ProjectWrapper>
  );
};

export default CircleProjectIcon;
