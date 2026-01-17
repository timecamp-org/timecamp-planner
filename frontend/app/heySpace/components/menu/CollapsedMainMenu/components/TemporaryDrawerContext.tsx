import { FC, createContext, useContext, useState } from 'react';

interface TemporaryDrawerContextInterface {
  drawerId: string;
  setDrawerId: (id: string) => void;
  toggleId: (id: string) => void;
  closeDrawer: () => void;
}

const Context = createContext<TemporaryDrawerContextInterface>({} as TemporaryDrawerContextInterface);

export const TemporaryDrawerContext: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [drawerId, setDrawerId] = useState('');

  const toggleId = (newId: string) => setDrawerId((id) => (id === newId ? '' : newId));
  const closeDrawer = () => setDrawerId('');

  return <Context.Provider value={{ drawerId, setDrawerId, toggleId, closeDrawer }}>{children}</Context.Provider>;
};

export const useTemporaryDrawerContext = () => useContext(Context);
