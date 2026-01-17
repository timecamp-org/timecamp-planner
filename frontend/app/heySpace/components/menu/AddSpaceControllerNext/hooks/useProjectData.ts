import { useState } from 'react';

import { ProjectInterface } from 'models/domain/ProjectsModel/types';

export const useProjectData = () => {
  const [projectData, setProjectData] = useState<Partial<ProjectInterface>>();

  return { projectData, setProjectData };
};
