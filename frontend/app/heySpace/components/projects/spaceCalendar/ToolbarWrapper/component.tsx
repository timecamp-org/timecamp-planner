import { FC } from 'react';

import { Views } from 'react-big-calendar';
import ToolbarCurrentDate from './ToolbarCurrentDate';
import ToolbarViews from './ToolbarViews';
import { ToolbarWrapperInterface } from './types';

import styles from './styles.css';

const ToolbarWrapper: FC<ToolbarWrapperInterface> = (props) => {
  const { currentView = Views.MONTH, onSetCurrentView } = props;

  return (
    <div className={styles.Component}>
      <ToolbarCurrentDate {...props} />
      <ToolbarViews currentView={currentView} onSetCurrentView={onSetCurrentView} />
    </div>
  );
};

export default ToolbarWrapper;
