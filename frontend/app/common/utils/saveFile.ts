import { saveAs } from 'file-saver';

const saveFile = (fileBlob: Blob, filename: string): void => {
  saveAs(fileBlob, filename);
};

export const saveCSVFile = (csv: string, filename: string): void => {
  const fileBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveFile(fileBlob, filename);
};

export default saveFile;

export const downloadFiles = async (files: { url: string; name: string }[]) => {
  const promises = files.map(
    ({ url, name }) =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          saveFile(blob, name);
          resolve(response.status);
        } catch (error) {
          reject(error);
        }
      })
  );
  await Promise.allSettled(promises);
};
