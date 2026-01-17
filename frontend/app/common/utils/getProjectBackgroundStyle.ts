export const getProjectBackgroundStyle = (background: string) => {
  const isUrl = background.includes('http');

  return isUrl
    ? {
        backgroundImage: `url(${background})`,
        backgroundColor: 'unset',
      }
    : { backgroundColor: background };
};
