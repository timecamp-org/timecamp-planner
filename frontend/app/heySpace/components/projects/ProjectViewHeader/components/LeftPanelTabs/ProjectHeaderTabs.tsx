import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getSizes } from './utils/getSizes';
import { getUnderlineStyle } from './utils/getUnderlyingStyles';
import styles from './styles.css';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

type ProjectHeaderTabsProps = {
  tabs: Array<{ Component: React.ReactNode; name: string }>;
};

const LeftPanelTabs = (props: ProjectHeaderTabsProps) => {
  const { tabs } = props;
  const tabsRef = useRef(null);

  const tabsRefs = useRef({});
  const [tabsSizes, setTabsSizes] = useState({});

  const { projectPanelType: selectedTab } = useParams<{ projectPanelType: ProjectPanelType }>();

  useLayoutEffect(() => {
    const sizes = getSizes({ tabsRef, tabsRefs });
    setTabsSizes(sizes);
  }, []);

  const underlineStyles = useMemo(() => getUnderlineStyle({ selectedTab, tabsSizes }), [selectedTab, tabsSizes]);

  return (
    <div ref={tabsRef} className={styles.projectHeaderTabs}>
      {tabs.map(({ Component, name }) => {
        return (
          <div
            ref={(ref) => (tabsRefs.current[name] = ref)}
            className={styles.projectHeaderTabItem}
            key={name}
            role="tab"
          >
            {Component}
          </div>
        );
      })}
      <div className={styles.projectHeaderUnderline} style={underlineStyles} />
    </div>
  );
};

export default LeftPanelTabs;
