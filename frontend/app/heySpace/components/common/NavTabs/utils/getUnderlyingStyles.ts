const transitionTime = 250;
const transitionStyle = `left ${transitionTime}ms, right ${transitionTime}ms`;

export const getUnderlineStyle = ({ selectedTab, tabsSizes }) => {
  if (selectedTab === null || Object.keys(tabsSizes).length === 0) {
    return { left: '0', right: '100%' };
  }
  const size = tabsSizes[selectedTab];

  return {
    left: `${size?.left || 0}px`,
    right: `${size?.right || 0}px`,
    transition: transitionStyle,
  };
};
