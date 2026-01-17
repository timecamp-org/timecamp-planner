import styled from 'styles/styled';
import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import TasksTable from 'components/tasks/TasksTable';
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors';
import { ProjectViewDataQueryParams } from 'models/domain/ProjectsModel/types';
import { onFetchProjectViewData, onFetchSpaceOrConversationViewData } from 'models/domain/RequestModel/actions';
import { selectFilteredAndSortedProjectTaskIds } from 'models/domain/TasksModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { FC, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { OverwatchFilterContext } from '../OverwatchViewTile';

interface SpaceListTileInterface {
  spaceId: Id;
}

const TaskTableWrapper = styled.div`
  height: 50rem;
`;

const SpaceListTile: FC<SpaceListTileInterface> = ({ spaceId }) => {
  const { filterId } = useContext(OverwatchFilterContext);
  const taskIds = useSelector((state) =>
    selectFilteredAndSortedProjectTaskIds(state, {
      projectId: spaceId,
      filterId,
    }),
  );
  const dispatch = useDispatch();

  const onFetch = (queryParams: ProjectViewDataQueryParams) => dispatch(onFetchProjectViewData(spaceId, queryParams));
  const fetchArchived =
    useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' })) ===
    TaskStatusFilterType.ARCHIVED;

  const queryParams = { fetchArchived };

  useEffect(() => {
    onFetch(queryParams);
  }, []);

  useEffect(() => {
    dispatch(onFetchSpaceOrConversationViewData(spaceId, filterId));
  }, []);

  return (
    <TaskTableWrapper>
      <TasksTable taskIds={taskIds} filterId={filterId} columnsConfig={{}} />
    </TaskTableWrapper>
  );
};
export default SpaceListTile;
