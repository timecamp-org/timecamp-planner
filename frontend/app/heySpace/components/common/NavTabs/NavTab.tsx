import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import TabNavButton from 'components/buttons/TabNavButton';

interface NavTab {
  isDisabled?: boolean;
  isActive?: boolean;
  projectColor?: string;
  to?: string;
  tabName: React.ReactNode;
  disabledMessage?: string;
}

const NavTab = ({ isDisabled, projectColor, isActive, to, tabName, disabledMessage }: NavTab) => {
  const element = (
    <TabNavButton color={projectColor} isDisabled={isDisabled} isActive={isActive} to={to}>
      {tabName}
    </TabNavButton>
  );

  return disabledMessage ? (
    <TooltipedDisabledElement isDisabled={isDisabled} message={disabledMessage}>
      {element}
    </TooltipedDisabledElement>
  ) : (
    element
  );
};

export default NavTab;
