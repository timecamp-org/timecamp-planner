import { useEffect, useState } from 'react';

export const useLoadingSkeleton = (isLoading: boolean, delay: number = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(isLoading);
    } else {
      setTimeout(() => {
        setShowSkeleton(isLoading);
      }, delay);
    }
  }, [isLoading, setShowSkeleton]);

  return showSkeleton;
};
