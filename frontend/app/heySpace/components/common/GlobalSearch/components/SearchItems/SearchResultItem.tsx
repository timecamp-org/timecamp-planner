/* eslint-disable camelcase */
import { FC } from 'react';

import { GlobalSearchResource, SearchResultInterface } from 'commonComponents/GlobalSearch/types';

import { ChatItem, ChatItemInterface } from './ChatItem';
import { FileItem, FileItemInterface } from './FileItem';
import { PersonItem, PersonItemInterface } from './PersonItem';
import { ProjectItem, ProjectItemInterface } from './ProjectItem';
import { TaskItem, TaskItemInterface } from './TaskItem';

export const SearchResultItem: FC<SearchResultInterface> = ({ entity, entityType }) => {
  switch (entityType) {
    case GlobalSearchResource.MESSAGE:
      return <ChatItem {...(entity as ChatItemInterface)} />;

    case GlobalSearchResource.FILE:
      return <FileItem {...(entity as FileItemInterface)} />;

    case GlobalSearchResource.USER:
      return <PersonItem {...(entity as PersonItemInterface)} />;

    case GlobalSearchResource.PROJECT:
      return <ProjectItem {...(entity as ProjectItemInterface)} />;

    case GlobalSearchResource.TASK:
      return <TaskItem {...(entity as TaskItemInterface)} />;

    default:
      return null;
  }
};
