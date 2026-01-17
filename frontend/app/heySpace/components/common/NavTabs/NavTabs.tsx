import React, { CSSProperties, useLayoutEffect, useMemo, useRef, useState } from 'react';

import styles from './styles.css';
import { getSizes } from './utils/getSizes';
import { getUnderlineStyle } from './utils/getUnderlyingStyles';

type ProjectHeaderTabsProps = {
  tabs: { Component: React.ReactNode; name: string }[];
  selectedTab: string;
  underlineStyles?: CSSProperties;
};

const LeftPanelTabs = (props: ProjectHeaderTabsProps) => {
  const { tabs, selectedTab, underlineStyles = {} } = props;
  const tabsRef = useRef(null);

  const tabsRefs = useRef({});
  const [tabsSizes, setTabsSizes] = useState({});

  const onHandleSetSizes = () => {
    const sizes = getSizes({ tabsRef, tabsRefs });
    setTabsSizes(sizes);
  };

  useLayoutEffect(() => {
    onHandleSetSizes();

    const observer = new ResizeObserver(() => {
      onHandleSetSizes();
    });
    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  const calculatedUnderlineStyles = useMemo(
    () => getUnderlineStyle({ selectedTab, tabsSizes }),
    [selectedTab, tabsSizes],
  );

  return (
    <div ref={tabsRef} className={styles.projectHeaderTabs}>
      {tabs.map(({ Component, name }) => (
        <div
          ref={(ref) => (tabsRefs.current[name] = ref)}
          className={styles.projectHeaderTabItem}
          key={name}
          role="tab"
        >
          {Component}
        </div>
      ))}
      <div
        className={styles.projectHeaderUnderline}
        style={{
          ...calculatedUnderlineStyles,
          ...underlineStyles,
        }}
      />
    </div>
  );
};

export default LeftPanelTabs;
