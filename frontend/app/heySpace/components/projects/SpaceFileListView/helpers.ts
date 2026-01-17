import { FileData, SelectedFileData } from './types';

export const convertFilteredData = ({ id, url, userId, name }: FileData): SelectedFileData => ({
  id,
  url,
  userId,
  name,
});

const calculateRowLimitCount = (screenHeight) => screenHeight / 50 - 4;

export const calculateTableMinHeight = ({ screenHeight, rowCount }) => {
  const rowLimitCount = calculateRowLimitCount(screenHeight);

  return rowCount < rowLimitCount ? rowCount * 50 + 100 : 'calc(100% - 70px)';
};
