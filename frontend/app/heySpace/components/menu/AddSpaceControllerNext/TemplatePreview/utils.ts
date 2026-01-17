const PROGRESS_PLACEHOLDER = [0, 25, 50, 75];
const TAG_PLACEHOLDER = ['UX/UI', 'High', 'Low', 'Bug'];
const COLORS = ['#fdebce', '#e5d9cd', '#d2f0f9', '#f8bfc1', '#d1cce5', '#ddeeee'];

export function getRandomArrayItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const getRandomBoolean = (): boolean => Math.random() < 0.5;

export function getRandomItems<T>(arr: T[]): T[] {
  const count = Math.floor(Math.random() * (arr.length + 1));
  const length = Math.min(Math.floor(Math.random() * (arr.length + 1)), count) || 1;

  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, length);
}

export function getFormattedDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export const getProgressPlaceholder = () => getRandomArrayItem(PROGRESS_PLACEHOLDER);

export const getTagPlaceholder = () => getRandomArrayItem(TAG_PLACEHOLDER);

export const getColor = () => getRandomArrayItem(COLORS);

export function getToday() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}.${month}.${year}`;
}
