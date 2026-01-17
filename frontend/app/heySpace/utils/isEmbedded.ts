import queryString from 'query-string';

export function isEmbedded(): boolean {
  const { embedded } = queryString.parse(window.location.search);
  return embedded === 'true';
}
