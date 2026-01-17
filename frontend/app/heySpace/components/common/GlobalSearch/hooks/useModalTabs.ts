import { useState } from 'react';

import { GlobalSearchResource } from '../types';

export const useModalTabs = () => {
  const [currentTab, setResource] = useState(GlobalSearchResource.MESSAGE);

  const onTabChange = (_, newValue: GlobalSearchResource) => {
    setResource(newValue);
  };

  return {
    currentTab,
    onTabChange,
  };
};
