import { useState } from 'react';

export enum ProjectCreationStep {
  DETAILS = 'DETAILS',
  WORKFLOW = 'WORKFLOW',
  TEMPLATE = 'TEMPLATE',
}

export const useProjectCreationStep = () => {
  const [step, setStep] = useState<ProjectCreationStep>(ProjectCreationStep.DETAILS);

  return { step, setStep };
};
