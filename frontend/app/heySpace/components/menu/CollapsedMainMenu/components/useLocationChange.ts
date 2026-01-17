import { useEffect } from 'react';

import { useLocation } from 'react-router';

export const useLocationChange = (onChange: () => void) => {
  const { pathname } = useLocation();

  useEffect(onChange, [pathname]);
};
