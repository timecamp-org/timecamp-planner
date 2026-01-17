import { useEffect, useRef } from 'react';

interface UseKeyboardInterface {
  onEnter?: VoidFunction;
  onEsc?: VoidFunction;
}

export const useKeyboard = ({ onEnter, onEsc }: UseKeyboardInterface) => {
  const onEnterRef = useRef(onEnter);
  const onEscRef = useRef(onEnter);

  onEnterRef.current = onEnter;
  onEscRef.current = onEsc;

  useEffect(() => {
    const listener = ({ key }: KeyboardEvent) => {
      switch (key) {
        case 'Enter':
          onEnterRef.current?.();
          break;
        case 'Escape':
          onEscRef.current?.();
          break;
        default:
          return;
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);
};
