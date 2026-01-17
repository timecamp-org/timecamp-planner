import { useState, useCallback } from 'react';

export type UseElementHook = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggleOpen: () => void;
  onSetIsOpen: (isOpen: boolean) => void;
};

export default function useElementOpen(defaultValue: boolean = false): UseElementHook {
  const [isOpen, onSetIsOpen] = useState(defaultValue);

  const onToggleOpen = useCallback(() => onSetIsOpen(!isOpen), [isOpen]);
  const onClose = useCallback(() => onSetIsOpen(false), []);
  const onOpen = useCallback(() => onSetIsOpen(true), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggleOpen,
    onSetIsOpen,
  };
}
