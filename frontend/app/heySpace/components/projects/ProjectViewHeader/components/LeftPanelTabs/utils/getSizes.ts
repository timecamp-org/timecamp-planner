export const getSizes = ({ tabsRef, tabsRefs }) => {
  const rootBounds = tabsRef.current.getBoundingClientRect();

  const sizes = {};
  Object.keys(tabsRefs.current).forEach((key) => {
    const el = tabsRefs.current[key];
    const bounds = el.getBoundingClientRect();

    const left = bounds.left - rootBounds.left;
    const right = rootBounds.right - bounds.right;

    sizes[key] = { left, right };
  });
  
  return sizes;
};