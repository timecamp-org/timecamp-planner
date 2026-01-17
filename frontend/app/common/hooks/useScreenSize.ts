import { useLayoutEffect, useState } from 'react';

interface ScreeSizeInterface {
  screenHeight: number;
  screenWidth: number;
}

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreeSizeInterface>({
    screenWidth: undefined,
    screenHeight: undefined,
  });

  useLayoutEffect(() => {
    const resizeHandler = () =>
      setScreenSize({
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth,
      });

    window.addEventListener('resize', resizeHandler);

    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return screenSize;
};
