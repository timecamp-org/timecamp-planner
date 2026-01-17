import React, { FC, useContext, useState } from 'react';

interface PopoverContextInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const INITIAL_CONTEXT = { isOpen: false } as PopoverContextInterface;

const PopoverOpenContext = React.createContext<PopoverContextInterface>(INITIAL_CONTEXT);

export const PopoverOpenContextProvider: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return <PopoverOpenContext.Provider value={{ isOpen, setIsOpen }}>{children}</PopoverOpenContext.Provider>;
};

export const usePopoverOpenContext = () => useContext(PopoverOpenContext);
